const express=require('express');
const router=express.Router();


const userController=require('../controllers/userController');

router.get('/getUserById/:id',userController.getUserById);
router.post('/login',userController.login);
router.post('/register',userController.register);
router.get('/getAllTasks/:id',userController.getAllTasks);
router.get('/admin/getLogs',userController.getLogs)
router.get('/admin/downloadLog/:logName', userController.downloadLog)
router.get('/admin/downloadLog/', userController.downloadLogError)
router.get('/profile/:id',userController.profile);
router.post('/updateProfile/:id',userController.updateProfile)
router.get('/restart_data', userController.restartData)

module.exports=router;