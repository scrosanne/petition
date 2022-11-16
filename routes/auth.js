const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const {
    updateUsers,
    getPasswordAndMoreByEmail,
    updateProfiles,
    getSignaturebyId,
} = require("../db");

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

router.get("/", function (req, res) {
    //check cookies, already registered or logged in?
    if (!req.session.userId) {
        res.redirect("/register");
    } else {
        if (req.session.hasSigned) {
            res.redirect("/thanks");
        } else {
            res.redirect("petition");
        }
    }
});

router.use(["/register", "/login"], (req, res, next) => {
    if (!req.session.userData) {
        next();
    } else {
        if (req.session.hasSigned) {
            res.redirect("/thanks");
        } else {
            res.redirect("petition");
        }
    }
});

// / / / / R E G I S T R A T I O N / / / /
router.get("/register", (req, res) => {
    res.render("register");
});

// / / / / R E G I S T R A T I O N / / / /
router.post("/register", (req, res) => {
    const { fname, lname, email, password } = req.body;
    const salt = bcrypt.genSaltSync(); //generate salt
    const hashedRegisterInput = bcrypt.hashSync(password, salt);

    console.log({
        firstname: fname,
        lastname: lname,
        email: email,
        password: hashedRegisterInput,
    });

    if (!fname || !lname || !email || !password) {
        //reload with error, if smth is missing
        res.render("register", { message: { error: "forgot something?" } });
        return;
    }

    //updates table "users"
    updateUsers({
        firstname: fname,
        lastname: lname,
        email: email,
        password: hashedRegisterInput,
    }).then((userData) => {
        req.session.userData = userData; //add new property with daa from users table to session object
        res.redirect("/profile");
    });
});

// / / / / / / G E T   M O R E   I N F O / / /
router.get("/profile", (req, res) => {
    if (!req.session.userData) {
        res.redirect("/register");
        return;
    }
    res.render("profile");
});

// / / / / / / / L O G  I N  / / / / / / /
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.render("login", {
            message: { error: "please fill in both fields!" },
        });
        return;
    } else {
        getPasswordAndMoreByEmail(email).then((objWithPass) => {
            //objWithPass contains hashed password from database
            if (
                //empty or input !== hash
                !objWithPass.rows[0] ||
                !bcrypt.compareSync(password, objWithPass.rows[0].password)
            ) {
                res.render("login", {
                    message: { error: "something went wrong!" },
                });
                //return;
            } else {
                // after loggin in ...
                req.session.userData = objWithPass.rows[0];

                //check for signature with Id we got by email before
                getSignaturebyId(objWithPass.rows[0].id).then((sign) => {
                    if (sign.rows[0].signature) {
                        req.session.hasSigned = true;
                        res.redirect("/thanks");
                        return;
                    } else {
                        res.redirect("/petition");
                    }
                });
            }
        });
    }
});

// / / / / / / G E T   M O R E   I N F O / / /
router.post("/profile", (req, res) => {
    const { age, city, homepage } = req.body;
    const userId = req.session.userData.id;

    //updates table "profiles"
    updateProfiles({
        age: age,
        city: city,
        url: homepage,
        user_id: userId,
    }).then((profileData) => {
        req.session.profileData = profileData;
        res.redirect("/petition");
    });
});

// / / / / / / / L O G  I N  / / / / / / /
router.get("/login", (req, res) => {
    res.render("login");
});

module.exports = router;
