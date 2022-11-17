const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const {
    deleteSignature,

    editProfiles,
    editUsersWithPassword,
    editUsersWithoutPassword,

    getSignersWithMoreInfo,
} = require("../db");

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// / / / / / / / U P D A T E  / / / / / / /
router.get("/profile/edit", (req, res) => {
    const userId = req.session.userData.id;

    getSignersWithMoreInfo(userId).then((result) => {
        console.log(result);
        const firstname = result.rows[0].firstname;
        const lastname = result.rows[0].lastname;
        const email = result.rows[0].email;
        const city = result.rows[0].city;
        const url = result.rows[0].url;
        const age = result.rows[0].age;

        console.log(firstname);
        res.render("edit", {
            signers: { firstname, lastname, email, age, city, url },
        });
    });
});

// / / / / / / / U P D A T E  / / / / / / /
router.post("/profile/edit", (req, res) => {
    const { fname, lname, email, password, age, city, homepage } = req.body;

    if (!req.session.userData) {
        res.redirect("/register");
        return;
    }

    if (password) {
        const salt = bcrypt.genSaltSync();
        const hashedEdit = bcrypt.hashSync(password, salt);

        Promise.all([
            editUsersWithPassword({
                firstname: fname,
                lastname: lname,
                email: email,
                password: hashedEdit,
                id: req.session.userData.id,
            }),
            editProfiles({
                age: age,
                city: city,
                url: homepage,
                user_id: req.session.userData.id,
            }),
        ])
            .then(() => {
                res.redirect("/thanks");
            })
            .catch((err) => console.log(err));
    } else {
        Promise.all([
            editUsersWithoutPassword({
                firstname: fname,
                lastname: lname,
                email: email,
                id: req.session.userData.id,
            }),
            editProfiles({
                age: age,
                city: city,
                url: homepage,
                user_id: req.session.userData.id,
            }),
        ])
            .then(() => {
                res.redirect("/thanks");
            })
            .catch((err) => console.log(err));
    }
});

// / / / / / / / D E L E T E  S I G N A T U R E  / / / / / / /
router.post("/signature/delete", (req, res) => {
    let userId = req.session.userData.id;
    deleteSignature(userId)
        .then(() => {
            req.session.hasSigned = false;
            res.redirect("/petition");
        })
        .catch((err) => console.log(err));
});

module.exports = router;
