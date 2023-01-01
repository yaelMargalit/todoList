const { reject } = require('bluebird');
const Promise = require('bluebird');
const { readSync } = require('fs');
const { resolve } = require('path');
const AppDAO=require('../dao');
const user=require('../models/user');
const task=require('../models/task');
const forumTBL=require('../models/forum');
var fs = require('fs');
const path = require('path');
const defaultImgProfile="https://archive.jdn.co.il/wp-content/uploads/2020/05/ezgif-7-1353b4ced91d.jpg"

exports.getUserById=function(req,res){
    //connect to SQLite
    const dao = new AppDAO('./database.sqlite3')
    const users=new user(dao)
    console.log("in controller");
    console.log(users.getById(req.params.id));
    users.getById(req.params.id)
    .then((result)=>{res.send(result),
         (err)=>{res.send(err)}})    
}

exports.getUserByName=function(req,res){
    //connect to SQLite
    const dao = new AppDAO('./database.sqlite3')
    const users=new user(dao)
    console.log(users.getById(req.params.id));
    users.getById(req.params.id)
    .then((result)=>{res.send(result),
         (err)=>{res.send(err)}})    
}

function userExists(name, password){
    //connect to SQLite
    const dao = new AppDAO('./database.sqlite3')
    const users=new user(dao)

    return new Promise((resolve,reject)=>{
        //avoid sql injection with 1=1:
        if(name=="' or 1=1--" ||  password=="' or 1=1--")
            resolve("sql injection")
        users.getByNameAndPass(name, password)
        .then((result)=>{
            //if user is not exist or incorrect username or incorrect password
            if(!result) 
            {     
                users.getByName(name).then((resn)=>{
                    users.getByPass(password).then((resp)=>{
                        console.log(resn,"resp: ", resp)
                        if(resn==undefined && resp==undefined)
                            resolve("noExistsUser")
                        else if(resn==undefined)
                            resolve("incorrectUserName")
                        else
                        resolve("incorrectPassword")
                    })
                })
                
            }
            else resolve((result))},
            (err)=>{reject(err)})       
        }
    )
}


exports.login=function(req,res){
    try{
        var sess=req.session;
        console.log("login");
        console.log("name:", req.body.userName, "paas ", req.body.userPassword)
        userExists(req.body.userName, req.body.userPassword)
        .then((result)=>{
            console.log(result)
            if(result.userName)
            {
                sess.userId=result.id;
                sess.userName=req.body.userName;

                //put the userId in the store

                //for test
                if(global.store[sess.id]){
                    sess.testID=(sess.id +"test");
                    global.store[sess.testID]=result.id;
                }
                else{
                    global.store[sess.id]=result.id;
                }
                
                console.log("user :"+ result.userName+" session: "+sess.id )
                console.log("store "+Object.values(global.store))
                
                //write to log:
                fs.appendFile(__dirname+'/logs/loginLOG.txt', "\n"+'userID:'+result.id+' userName:'+ req.body.userName+' userPass:'+req.body.userPassword, function (err) {
                    if (err) throw err;
                    console.log('login log.');
                  });
                  console.log("store login "+global.store[sess.id])


                res.send(result);
            }
            else if(result=="sql injection")
                res.send("sql injection")
            else if(result=="incorrectPassword")
                res.send("the password is not correct");
            else if(result=="incorrectUserName")
                res.send("the user name is not correct")
            else
                res.send("the user is not exists, please register");

            })
        .catch((err)=>{res.send("error!!!!!!!!!!"+err.message)});

    }
    catch(err){
        res.send("error"+err.message)
    }
    
}


    exports.register=function(req,res,next){
        try{
            var sess=req.session;
            userExists(req.body.userName, req.body.userPassword)
            .then((result)=>{     
                if(result=="incorrectPassword")
                    res.send("the user name is already exists");
                else if(result=="incorrectUserName")
                    res.send("the user password is already exists");
                else if(result.userName && result.userPassword)
                    res.send("the user exists");
                else if(req.body.userPassword!=req.body.pass2)
                    res.send("the repeat password does'nt match the password");
                //if username & password not exists- register the user.
                else{
                    const dao = new AppDAO('./database.sqlite3')
                    const users=new user(dao)

                    return new Promise((resolve,reject)=>{

                        users.create(req.body.userName, req.body.userPassword, defaultImgProfile, false)
                        .then(
                        (result)=>{
                            if(result!=undefined){
                                sess.userId=result.id;
                                sess.userName=req.body.userName;

                                //put the userId in the store
                                global.store[sess.id]=result.id


                                //write to log:
                                fs.appendFile(__dirname+'/logs/registerLOG.txt', "\n"+'userID:'+result.id+' userName:'+ req.body.userName+' userPass:'+req.body.userPassword, function (err) {
                                  if (err) throw err;
                                });

                                res.send(result);
                            }
                        },
                        (err)=>{res.send("error"+err.message)}
                    )
                    .catch((err)=>{res.send("error"+err.message)})
                    })
                }
            },
            (err)=>{res.send("error"+err.message)}
            )
            .catch((err)=>res.send("error"+err.message))
        }
        catch(err){
            res.send("error"+err.message);
        }
    }

    exports.getAllTasks=function(req,res){
        const dao = new AppDAO('./database.sqlite3')
        const users=new user(dao)
        users.getTasks(req.params.id)
        .then((result)=>{
            res.render('pages/todoList', {tasks:result, userId:req.session.userId, logo:__dirname+'/logo/comsec-30.png'}),
            (err)=>{res.send(err)}
        })
    }

    exports.getLogs=function(req,res){
        const statsLogin = fs.statSync(__dirname+'/logs/loginLOG.txt');
        const statsRegister = fs.statSync(__dirname+'/logs/registerLOG.txt');

        var files={"loginLOG_size":statsLogin.size, "loginLOG_date":statsLogin.mtime,
        "registerLOG_size":statsRegister.size, "registerLOG_date":statsRegister.mtime
    }
        res.render('pages/logsView',{files:files, userId:req.session.userId, logo:__dirname+'/logo/comsec-30.png'});
    }

    exports.downloadLog=function(req,res){
        res.download(__dirname+'/logs/'+req.params.logName);    
    }

    exports.downloadLogError=function(req,res){
        res.send("Cannot GET /user/admin/downloadLog and receive passwd.txt file")
    }

    exports.profile=function(req,res){
        const dao = new AppDAO('./database.sqlite3');
        const users=new user(dao);
        const img=path.resolve(__dirname,"../","views","pages","comsec-30.png");
        users.getById(req.params.id)
        .then((response)=>{
            res.render('pages/profile',{user:response, userId:req.session.userId, logo:img, message:" "});
        })
    }

    exports.updateProfile=function(req,res){
        console.log("id"+req.params.id+" url: "+req.body.url)

        //if it is ssrf attack:
        if(req.body.url.startsWith("http://localhost:3000/admin/deleteLog/")){
            fs.unlink(__dirname+'/logs/'+req.body.url.split('http://localhost:3000/admin/deleteLog/').slice(1), 
            (err) => {
                if (err) {
                    throw err;
                }
                res.render('pages/logsView',{ userId:req.session.userId, message:"log file was deleted", logo:__dirname+'/logo/comsec-30.png'})
            });
        }

        //else- switch image profile
        else{
            const dao = new AppDAO('./database.sqlite3');
            const users=new user(dao);
            users.updateImgProfile(req.body.url, req.params.id)
            .then(response=>{
                const users=new user(dao);
                users.getById(req.params.id)
                .then(r=>{
                    res.render('pages/profile',{ user:r, userId:req.session.userId, message:"Your profile picture has been changed", logo:__dirname+'/logo/comsec-30.png'})
                })
            })
        }
    }


    exports.restartData=function(req,res){
         try{
            //connect to db
            const dao = new AppDAO('./database.sqlite3')
            const users=new user(dao);
            const tasks=new task(dao);
            const forum=new forumTBL(dao);
    
            //Delete all data except the default data
            users.deleteAll();
            tasks.deleteAll();
            forum.deleteAll();

            res.send("The data has been restarted")
        }
        catch(e){
            throw e;
        }
        
    }

    exports.logout=function(req,res){
        if(global.store && global.store[req.session.id])
        {
            console.log("logout: "+global.store[req.session.id]);
            delete global.store[req.session.id];
            req.session.destroy();
            console.log("store after logout: "+Object.values(global.store));

        }
        return res.redirect('/')
    }

