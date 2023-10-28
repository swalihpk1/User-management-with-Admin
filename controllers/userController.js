const { name } = require("ejs");
const User = require("../models/usersModels");
const bcrypt = require("bcrypt");

// ----------Signup------------
const signup = async (req, res) => {
    try {

        res.render('signup');

    } catch (error) {
        console.log(error.message);
    }
}

// -------password-security(bcrypt)-------
const securePassword = async (password) => {
    try {

        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;

    } catch (error) {
        console.log(error.message);
    }
}

// ----------Insert_User_Datas----------
const insertUser = async (req, res) => {
    try {

        const {email} = req.body;
        const userCheck = await User.findOne({ email });
        if (userCheck) {
          return res.render("signup", {
            message: "User already exist, please login"
          });
        }

        const securepassword = await securePassword(req.body.password);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: securepassword,

        });
        const userData = await user.save();

        if (userData) {
            res.render('home',{user:userData});
        } else {
            res.render('signup', { message: "Signup seccessfully failed" });

        }

    } catch (error) {

        console.log(error.message);

    }
}

// ---------User_login--------
const login = async (req, res) => {

    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);

    }
}

// -----Verify_Login-------
const verifyLogin = async (req, res) => {

    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({ email: email });

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {

                req.session.user_id = userData._id;
                res.redirect('/home');

            } else {
                res.render('login', { message: "Incorrect username or password", type: "error" });
            }

        } else {

            res.render('login', { message: "Incorrect username or password" });
        }
    } catch (error) {
        console.log(error.message);
    }
}

// ---------Home--------
const home = async (req, res) => {
    try {

        const userData = await User.findById({ _id: req.session.user_id });
        res.render('home', { user: userData });

    } catch (error) {

        console.log(error.message);
    }
}

//--------User_Logout--------
const logout = async (req, res) => {
    try {

        req.session.destroy();
        res.redirect('/');

    } catch (error) {
        console.log(error.message);
    }
}
module.exports = {
    signup,
    insertUser,
    login,
    verifyLogin,
    home,
    logout,


}