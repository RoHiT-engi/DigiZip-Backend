const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router  = express.Router();
const User = require('../models/UserData')
const Joi = require("@hapi/joi");
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator') ;
const {adduser, checkotp, getuser} = require('../middleware/UserMiddleware')
const registerSchema = Joi.object({
    email : Joi.string().email().required(),
    aadhaar : Joi.string().min(12).max(12).required(),
})


router.route('/register').post(adduser).get(getuser);
router.route('/check').post(checkotp);


// router.post('/check',

// router.get('/get', 




module.exports = router;


