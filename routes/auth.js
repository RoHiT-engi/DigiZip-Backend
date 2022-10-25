const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router  = express.Router();
const User = require('../models/UserData')
const Joi = require("@hapi/joi");

const registerSchema = Joi.object({
    email : Joi.string().email().required(),
    aadhaar : Joi.string().min(12).max(12).required(),
    // usertoken : Joi.object()
})

router.post('/register', async (req, res) => {
    const emailExist = await User.findOne({"email": req.body.email});

    if(emailExist) return res.status(400).send('Email already exists');

    const user = new User({
        email : req.body.email,
        aadhaar : req.body.aadhaar,
        // usertoken : req.body.usertoken || null
    })

    try {
        //VALIDATION OF USER INPUTS
    
        const { error } = await registerSchema.validateAsync(req.body);
        //WE CAN JUST GET THE ERROR(IF EXISTS) WITH OBJECT DECONSTRUCTION
    
        //   IF ERROR EXISTS THEN SEND BACK THE ERROR
        if (error) {
          res.status(400).send(error.details[0].message);
          return;
        } else {
          //NEW USER IS ADDED
          const saveUser = await user.save();
          res.status(200).send("user created");
        }
      } catch (error) {
        res.status(500).send(error);
      }
})






module.exports = router;


