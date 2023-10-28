const express = require("express");
const adminRoute = express();
const adminController = require("../controllers/adminControllers");
const { login } = require("../controllers/userController");
const auth = require("../middlewares/adminAuth");


adminRoute.use(express.json());
adminRoute.use(express.urlencoded({extended:true})); 

adminRoute.set('view engine','ejs');
adminRoute.set('views','./views/admin');

// Admin-Signup
adminRoute.get('/signup',auth.isLogout,adminController.signup);
adminRoute.post('/signup',auth.validateForm,adminController.insertAdmin);

// Admin-login
adminRoute.get('/',auth.isLogout,adminController.login);
adminRoute.post('/',adminController.verifyLogin);

//Admin-home
adminRoute.get('/home',auth.isLogin,adminController.home);

//Admin-logout
adminRoute.get('/logout',auth.isLogin,adminController.logout);

//Add-user
adminRoute.get('/addUser',auth.isLogin,adminController.addUser);
adminRoute.post('/addUser',adminController.insertUser);

//Edit-user
adminRoute.get('/editUser',auth.isLogin,adminController.editUser);
adminRoute.post('/editUser',auth.isLogin,adminController.updateUser);

//Delete-user 
adminRoute.get('/deleteUser',adminController.deleteUser);

adminRoute.get('*',(req,res)=>{
    res.redirect('/admin');
});

module.exports = adminRoute;
