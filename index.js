const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/company");
// _____________________________________________________ //

const express = require("express");
const app = express();
const nocache = require("nocache");
const  session = require("express-session");
const config = require("./config/config");


app.use(session({
    secret:config.sessionSecret,
    resave: false,
    saveUninitialized: true 
}));

app.use(nocache());

app.use(express.json());
app.use(express.urlencoded({extended:true})); 


// User_Routes
const userRoute = require("./routes/userRoute");
app.use('/',userRoute);
 
// Admin_Routes
const adminRoute = require("./routes/adminRoute");
app.use('/admin',adminRoute);
 


app.listen(7001,()=>{console.log("Server started...")});
