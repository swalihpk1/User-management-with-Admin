const Admin = require("../models/AdminModels");
const bcrypt = require("bcrypt");
const User = require("../models/usersModels");
const randomString = require("randomstring");

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

// ----------Insert_Admin_Datas----------
const insertAdmin = async (req, res) => {
    try {
        const {email} = req.body;
        const adminCheck = await Admin.findOne({ email });
        if (adminCheck) {
          return res.render("signup", {
            message: "Admin already exist, please login"
          });
        }

        const securepassword = await securePassword(req.body.password);
        const admin = new Admin({
            name: req.body.name,
            email: req.body.email,
            password: securepassword,
        });
        const adminData = await admin.save();
  
        if (adminData) {
            res.render('login', { message:"Sign up successfully,please login",color:"success"});
        } else {
            res.render('signup', { message: "Signup seccessfully failed" });

        }

    } catch (error) {

        console.log(error.message);

    }
}


// -------login------
const login = async (req, res) => {
    try {

        res.render('login');

    } catch (error) {
        console.log(error.message);
    }
}

//------verify_login-------
const verifyLogin = async (req, res) => {

    try {
        const email = req.body.email;
        const password = req.body.password;
        const adminData = await Admin.findOne({ email: email });

        console.log(adminData);

        if (adminData) {
            const passwordMatch = await bcrypt.compare(password, adminData.password);
            if (passwordMatch) {

                req.session.admin_id = adminData._id;
                res.redirect('/admin/home');

            } else {

                res.render('login', { message: "Incorrect username or password",color:"danger"});
            }

        } else {

            res.render('login', { message: "Incorrect username or password",color:"danger" });
        }
    } catch (error) {
        console.log(error.message);
    }
}


// -----Home-----
const home = async (req, res) => {
    try {

        var search = '';
        if (req.query.search) {
            search = req.query.search;
        }

        const message = req.query.message;
        const adminData = await Admin.findById({ _id: req.session.admin_id });
        const userData = await User.find({
            $or: [
                { name: { $regex: '.*'+search+'.*',$options:'i'} },
                { email: { $regex: '.*'+search+'.*',$options:'i'} },
                { phone: { $regex: '.*'+search+'.*',$options:'i'} },
            ]
        });

        res.render('home', { admin: adminData, users: userData, message: message });

    } catch (error) {
        console.log(error.message);
    }
}

//------Logout-----
const logout = async (req, res) => {
    try {

        req.session.destroy();
        res.redirect('/admin');

    } catch (error) {
        console.log(error.message);
    }
}

//-------Add-user-------
const addUser = async (req, res) => {
    try {
        res.render('add-user');
    } catch (error) {
        console.log(error.message);
    }
}

//------Insert_User_Data---------
const insertUser = async (req, res) => {
    try {

        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const password = randomString.generate(8);


        const securepassword = await securePassword(password);
        const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: securepassword
        });

        const userData = await user.save();

        if (userData) {

            const message = "new user added ";
            res.redirect(`/admin/home?message=${message}`);

        } else {

            res.render('add-user', { message: "Something wrong" });
        }


    } catch (error) {
        console.log(error.message);
    }
}

// ------Edit-User--------
const editUser = async (req, res) => {
    try {

        const id = req.query.id;
        const userData = await User.findById({ _id: id })
        if (userData) {

            res.render('edit-user', { user: userData });

        } else {
            res.redirect('/admin/home');
        }

    } catch (error) {

        console.log(error.message);
    }
}

// -----Update-user-----
const updateUser = async (req, res) => {
    try {

        await User.findByIdAndUpdate({ _id: req.body.id }, { $set: { name: req.body.name, email: req.body.email, phone: req.body.phone } });
        const message = "Update successfully";
        res.redirect(`/admin/home?message=${message}`);


    } catch (error) {
        console.log(error.message);
    }
}

//------Delete-user------
const deleteUser = async (req, res) => {
    try {

        const id = req.query.id;
        await User.deleteOne({ _id: id });
        const message = "Delete successfully";
        res.redirect(`/admin/home?message=${message}`);

    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    signup,
    insertAdmin,
    login,
    verifyLogin,
    home,
    logout,
    addUser,
    insertUser,
    editUser,
    updateUser,
    deleteUser
}