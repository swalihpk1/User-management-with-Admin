const session = require("express-session");

const isLogin = async(req,res,next)=>{

    try {
        if (req.session.admin_id) {
            next();
        } else {
            res.redirect('/admin');
        }
   
        
    } catch (error) {
        console.log(error.message);
    }
}
const isLogout = async(req,res,next)=>{

    try {
        if (req.session.admin_id) {

           return res.redirect('/admin/home');
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}
const validateForm = (req, res, next) => {
    try {
        const { email, name, phone } = req.body;
        let regexEmail = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
        let regexName = /\d/;
        if (regexName.test(name)) {
            return res.render('signup', { message: "Name shouldn't contain digits", color: "danger" });

        } if (name.length <= 5) {
            return res.render('signup', { message: "minimum 5 characters in name", color: "danger" });
        }
        if (!regexEmail.test(email)) {
            return res.render('signup', { message: "Invalid email address", color: "dange" });
        }
        next();
    } catch (error) {
        console.log(error);
    }

}

module.exports = {
    isLogout,
    isLogin,
    validateForm
}