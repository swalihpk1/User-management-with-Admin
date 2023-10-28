const express = require("express");
const userRoute = express();
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");



userRoute.set('view engine','ejs');
userRoute.set('views','./views/users');

// SIGN-UP
userRoute.get('/signup',auth.isLogout,userController.signup);
userRoute.post('/signup',auth.validateForm,userController.insertUser);

// LOGIN
userRoute.get('/',auth.isLogout,userController.login);
userRoute.get('/login',auth.isLogout,userController.login);
userRoute.post('/login',userController.verifyLogin);
userRoute.post('/',userController.verifyLogin);

// HOME
userRoute.get('/home',auth.isLogin,userController.home);

//LOGOUT
userRoute.get('/logout',auth.isLogin,userController.logout);





module.exports = userRoute;