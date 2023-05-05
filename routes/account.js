var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/User.model")

router.get('/profile', (req, res, next) => {
    let username = req.session.user
    console.log(req.session)
    res.render('account/profile.hbs', username)
})


module.exports = router;