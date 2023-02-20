const Org = require('../models/Org');
const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator') ;
const crypto = require('crypto');

// AddOrg
// not Tested
const makeOrg = asyncHandler(async (req, res) => {
    const gst = Org.findOne({"gst_no": req.body.gst_no});
    const admin = Org.findOne({"admin": req.body.admin});
    if(gst!=null && admin!=null && gst.name!=req.body.name ) {
        try{
            const hashValue = crypto.createHash('sha256', req.body.name)
            .update(req.body.gst_no)
            .update(req.body.admin)
            .digest('hex');
            
            const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
            const adder = new Org({
                "name": req.body.name,
                "gst_no": req.body.gst_no,
                "admin": req.body.admin,
                "accounts": req.body.accounts,
                "verified": req.body.verified,
                "generated_hash": hashValue,
                "otp": otp
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
      to: req.body.admin,
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
            await adder.save();
            res.status(200).send("Org created");
            // }
          }
        });
    
    } catch (error) {
        res.status(400).send(error);
    }
            res.status(200).send("request sent");
        }catch(e){
            res.status(400).send(e);
        }
    }else{
        res.status(400).send("user not found");
    }
});

// GetOrg
// not Tested
const getOrg = asyncHandler(async (req, res) => {
    try{
    const addmin = Org.findOne({"admin": req.query.admin});
    // const checksub = Org.findOne({"accounts.email": req.query.admin});
    if(addmin!=null) {
        res.status(200).send(addmin);
    }
    // else if(checksub!=null){
    //     res.status(200).send(checksub);
    // }
    else{
        res.status(400).send("org not found");
    }}
    catch(e){
        res.status(400).send(e);
    }

});

// DeleteOrg
// not Tested
const deleteOrg = asyncHandler(async (req, res) => {
    try {
        const admin = Org.findOne({"admin": req.body.admin});
        if(admin!=null){
            await admin.delete();
            res.status(200).send("deleted");
        }else{
            res.status(400).send("user not found");
        }
    } catch (error) {
        
    }
});


// check otp 
// not Tested
const checkOtp = asyncHandler(async (req, res) => {
    try{
        const admin = Org.findOne({"admin": req.body.admin});
        if(admin!=null){
            if(admin.otp==req.body.otp){
                res.status(200).send("verified");
            }else{
                res.status(400).send("otp not matched");
            }
        }else{
            res.status(400).send("user not found");
        }
    }catch(e){
        res.status(400).send(e);
    }
});


// Exporting the functions
module.exports = {
    makeOrg,
    getOrg,
    deleteOrg,
    checkOtp,
}