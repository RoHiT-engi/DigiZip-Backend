// const express = require('express')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
// const router  = express.Router();
const User = require('../models/UserData')
// const Joi = require("@hapi/joi");
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator') ;
const asyncHandler = require('express-async-handler')
// const registerSchema = require('../validation/registerValidation');

// add user
// tested
const adduser = asyncHandler(async (req, res) => {
  res.header('Access-Control-Allow-Methods', 'POST');
    const emailExist = await User.findOne({"email": req.body.email});
    const aadharExist = await User.findOne({"aadhaar": req.body.aadhaar});
    if(emailExist==null && aadharExist==null) {
      // console.log('Email or aadhar already exists');
      const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
    const user = new User({
        email : req.body.email,
        aadhaar : req.body.aadhaar,
        verified : false,
        otp : otp
    })
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });
    var mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: 'This Mail is to verify the otp',
      text: 'Your otp is '+otp
    };
    
    try {
        //VALIDATION OF USER INPUTS
        transporter.sendMail(mailOptions, async function(error, info){
          if (error) {
            res.status(400).send(error);
          } else {
            console.log('Email sent: ' + info.response);
            // const { error } = await registerSchema.validateAsync(req.body);
        
            // if (error) {
            //   res.status(400).send(error.details[0].message);
            // }  else {
              await user.save();
              res.status(200).send("user created");
            // }
          }
        });
    
    } catch (error) {
        res.status(400).send(error);
    }}else{
      res.status(400).send('Email or aadhar already exists');
    }
});

// check otp
// tested
const checkotp = asyncHandler(async (req, res) => {
    const emailExist = await User.findOne({"email": req.body.email});
    if(emailExist!=null) {
      const otp = req.body.otp;
      if(emailExist.otp == otp){
        emailExist.verified = true;
        emailExist.save();
        res.status(200).send('User verified');
      }else{
        res.status(400).send('Wrong otp');
      }
    }else{
      res.status(400).send('User do not exists');
    }
});

// get user
// tested
const getuser = asyncHandler(async (req, res) => {
    const email = req.query.email;
    const user = await User.findOne({"email": email});
    if(user!=null){
      res.status(200).send(user);
    }else{
      res.status(400).send('User do not exists');
    }
  });

module.exports = {adduser, checkotp, getuser};