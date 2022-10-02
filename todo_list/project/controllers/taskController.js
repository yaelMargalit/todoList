const Promise = require('bluebird');
const AppDAO=require('../dao');
const task=require('../models/task');
const forum=require('../models/forum');
const user=require('../models/user');
const path = require('path');
const { appendFile } = require('fs');
const { Console } = require('console');




exports.getAllTasks=function(req,res){

}

exports.deleteTask=function(req,res){
    //connect to SQLite
    const dao = new AppDAO('./database.sqlite3')
    const tasks=new task(dao);
    tasks.delete(req.params.id)
    .then((result)=>{
        res.send("delete task");
    })
}

exports.addTask=function(req,res){
    //connect to SQLite
    const dao = new AppDAO('./database.sqlite3')
    const tasks=new task(dao);
    tasks.create(req.params.taskName,"todo",req.session.userId, false)
    .then((result)=>{
        console.log("OOOOO"+result)
        res.send("create task");
    })
}

exports.updateTaskStatus=function(req,res){
    //csrf:
    //if user is register- can update todo list:
    if(req.session.id){
        const dao = new AppDAO('./database.sqlite3')
        const tasks=new task(dao);
        for(var i=0;i<req.body.tasksLst.length-1;i++){
            tasks.update(req.body.tasksLst[i].task).then(R=>console.log("UPDATE status",req.body.tasksLst[i].task))
        }
        tasks.update(req.body.tasksLst[req.body.tasksLst.length-1].task)
        .then(response=>{
            console.log("UPDATE status", req.body.tasksLst[req.body.tasksLst.length-1].task)
            res.send("update");
        })
    }
    //if not:
    else{
        res.send("user is not register");
    }

}

exports.getForum=function(req,res){
    const dao = new AppDAO('./database.sqlite3')
    const forums=new forum(dao);
    const users=new user(dao);
    forums.getAll()
    .then((frmRes)=>{
        users.getAll()
            .then((userRes)=>{
                console.log("000000",userRes)
                res.render('pages/forum', {forum:frmRes, users:userRes, userId:req.session.userId, logo:__dirname+'/logo/comsec-30.png'});
            })
    }
    )
    
}



exports.getFile=function(req,res){
    res.sendFile(path.join(__dirname,'/uploadFiles/'+req.params.fileName))
}


exports.addPostForum=function(req,res){
    var today = new Date();
    const dao = new AppDAO('./database.sqlite3')
    const forums=new forum(dao);
    forums.create(req.body.threadTitle, req.body.threadDescription, today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(),
    req.files?req.files.myFile.name:null, req.body.userId, false)
     .then((result)=>{
        //if there is a upload file- save it in the uploadFiles directory/
        if(req.files)
        {
            const file = req.files.myFile;
            const path = __dirname + "/uploadFiles/" + file.name;
            
            file.mv(path, (err) => {
              if (err) {
                return res.status(500).send(err);
              }
            })
        }
        exports.getForum(req,res);
    }
     )
}

