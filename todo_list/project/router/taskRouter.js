const { Router } = require('express');
const express=require('express');
const router=express.Router();


const taskController=require('../controllers/taskController');
const { route } = require('./userRouter');

router.get('/getAllTasks', taskController.getAllTasks);
router.get('/forum', taskController.getForum);
router.get('/getFile/:fileName', taskController.getFile);
router.post('/addPostForum',taskController.addPostForum);
router.get('/addTask/:taskName/:currentUserId',taskController.addTask);
router.get('/deleteTask/:id',taskController.deleteTask);
router.post('/updateTask',taskController.updateTaskStatus)

module.exports=router;