const express=require('express');
const session = require('express-session');
const userRouter=require('./router/userRouter')
const taskRouter=require('./router/taskRouter')
const Promise = require('bluebird')
const AppDAO=require('./dao');
const user=require('./models/user');
const task=require('./models/task');
const { resolve } = require('path');
const { reject } = require('bluebird');
var bodyParser = require('body-parser');
const cors=require("cors");
const forumTBL=require('./models/forum');
const fileUpload = require('express-fileupload');


const defaultImgProfile="https://archive.jdn.co.il/wp-content/uploads/2020/05/ezgif-7-1353b4ced91d.jpg"



//create a web service
var app=express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());



const corsOptions ={
   origin:'*', 
   credentials:true,            
   optionSuccessStatus:200,
}

global.store={};

app.use(cors(corsOptions))

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    next();
})


app.use(session({secret: 'Qwdtyh1234'}));


app.listen(3000,function(){
    console.log("in port 3000")
});




//create default data in DB if not exist.
try{
    //connect to db
    const dao = new AppDAO('./database.sqlite3')

    //create a default users table:
    const users=new user(dao);
    users.createTable()
    .then(()=>{
         users.getByName("admin").then((response)=>{
            if(!response)
            {
                users.create("admin","admin1234", "https://images.globes.co.il/images/NewGlobes/big_image_800/2018/1E63520A7E6D262804A3B64A3DD2CEC7_800x392.20180404T105103.jpg", true)
                .then(()=>users.create("Roni", "qwe123", "https://files.geektime.co.il/wp-content/uploads/2015/10/shutterstock_253413775.jpg", true))
                .then(()=>users.create("Shani", "sh9090",defaultImgProfile , true))
            }
        })
    })


    //create a default tasks table:
    const tasks=new task(dao);
    tasks.createTable()
    .then((response)=>{console.log(response, "kkkkkkkkk")
        tasks.getByTaskName("Status meeting").then((response)=>{
            if(!response)
            {
                tasks.create("Status meeting", "todo", 1, true);
                tasks.create("Check security issues", "todo", 1, true);
                tasks.create("Fix SQL Injection", "complete", 1, true);

                tasks.create("finish calculate tasks", "completed", 2, true);
                tasks.create("check about programing ", "todo", 2, true);
                tasks.create("Determine zoom meeting", "completed", 2, true);
                
                tasks.create("upload to git", "todo", 3, true);
            }
        })
        
    })


    //create a default forum table:
    const forum=new forumTBL(dao);
    var today = new Date();
        forum.createTable()
        .then((response)=>{console.log(response, "kkkkkkkkk")
            forum.getByTitle("upgrade version").then((response)=>{
                if(!response)
                {
                    forum.create("upgrade version", "I finish to upgrade the php version on the system.", 
                    today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(), "pic.png", 1, true);
    
                    forum.create("upload to git", "Hi, I need help, how can I upload my project to git?", 
                    today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(), null, 3, true);
                }
            })
    })
}
catch(e){
    throw e;
}





var path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')


//agree to use all files in this folder
app.use(express.static('views/pages'))

app.get('/',function(req,res){
    res.render('pages/login')
})


app.use('/user',userRouter);
app.use('/task',taskRouter)