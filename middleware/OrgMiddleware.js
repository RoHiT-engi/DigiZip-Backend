const Org = require('../models/Org');
const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator') ;
const crypto = require('crypto');

// AddOrg
// Tested
const makeOrg = asyncHandler(async (req, res) => {
    const gst = await Org.findOne({"gst_no": req.body.gst_no});
    const name = await Org.findOne({"name": req.body.name});
    const admin = await Org.findOne({"admin": req.body.admin});
    console.log(gst);
    if(gst==null && admin==null && name==null) {
        try{
            const hashValue = crypto.createHash('sha256', req.body.name)
            .update(req.body.gst_no)
            .update(req.body.admin)
            .digest('hex');
            const otp = otpGenerator.generate(6, { digits: true });
            const adder = new Org({
                "name": req.body.name,
                "gst_no": req.body.gst_no,
                "admin": req.body.admin,
                "accounts": [],
                "verified_admin": false,
                "verified_org": false,
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
                    // }
            }
            });
            res.status(200).send("request sent");
        }catch(e){
            res.status(400).send(e);
        }
    }else{
        res.status(400).send("user already registered");
    }
});

// GetOrg
// Tested
const getOrg = asyncHandler(async (req, res) => {
    try{
    const addmin = await Org.findOne({"admin": req.query.email});
    const checksub = await Org.find({"accounts.email": req.query.email});
    if(addmin) {
        res.status(200).send(addmin);
    }else if(checksub){
        res.status(200).send(checksub);
    }else{
        res.status(400).send("org not found");
    }}
    catch(e){
        res.status(400).send(e);
    }

});

// DeleteOrg
// Tested
const deleteOrg = asyncHandler(async (req, res) => {
    try {
        const admin =await Org.findOne({"admin": req.query.admin});
        console.log(admin);
        if(admin){
            await admin.delete();
            res.status(200).send("deleted");
        }else{
            res.status(400).send("user not found");
        }
    } catch (e) {
        res.status(400).send(e);
    }
});


// check otp 
// Tested
const checkOtp = asyncHandler(async (req, res) => {
    try{
        const admin =await Org.findOne({"admin": req.body.admin});
        if(admin){
            if(admin.otp==req.body.otp){
                admin.verified_admin = true;
                await admin.save();
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