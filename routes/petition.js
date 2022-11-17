const express = require("express");
const router = express.Router();

const {
    insertSignature,

    getSigners,
    getSignersByCity,
    getSignaturebyId,
    getSignersWithMoreInfo,
} = require("../db");

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// / / / / / / S I G N A T U R E  / / /
router.get("/petition", (req, res) => {
    if (req.session.userData) {
        if (req.session.hasSigned) {
            res.redirect("/thanks");
        }
        res.render("petition");
        return;
    }
    res.redirect("/register");
});

// / / / / / / S I G N A T U R E  / / /
router.post("/petition", (req, res) => {
    const { signature } = req.body;

    if (!signature) {
        res.render("petition", { message: { error: "changed your mind?" } });
        return;
    }

    //updates table "signatures"
    insertSignature({
        signature: signature,
        id: req.session.userData.id,
    }).then(() => {
        req.session.hasSigned = true;
        res.redirect("/thanks");
    });
});

//*******************************************

//THANKS
router.get("/thanks", (req, res) => {
    if (!req.session.userData) {
        res.redirect("/register");
        return;
    }

    Promise.all([
        getSigners(),
        getSignaturebyId(req.session.userData.id),
        getSignersWithMoreInfo(req.session.userData.id),
    ]).then((result) => {
        //result[1] contains signature
        const count = result[0].rowCount;
        const name = result[2].rows[0].firstname;
        const sign = result[1].rows;

        res.render("thanks", { name, count, image: sign });
    });
});

//*******************************************

//LIST SIGNERS
router.get("/signers", (req, res) => {
    if (!req.session.userData) {
        res.redirect("/register");
        return;
    }

    getSigners().then((result) => {
        res.render("signers", { signers: result.rows });
    });
});

//LIST CITY
router.get("/signers/:city", (req, res) => {
    if (!req.session.userData) {
        res.redirect("/register");
        return;
    }

    const city = req.params.city;
    getSignersByCity(city).then((signers) => {
        res.render("city", { signers: signers.rows, city });
    });
});

//*******************************************

module.exports = router;
