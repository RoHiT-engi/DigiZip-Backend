const Org = require('../models/Org');
const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator') ;
const crypto = require('crypto');
const User = require('../models/UserData');
const Preset = require('../models/CustomPresets');

// TODO : -



// AddOrg
// Tested
const makeOrg = asyncHandler(async (req, res) => {
    const useracc = await User.findOne({"email": req.body.admin});
    const hash = crypto.createHash('sha256', req.body.name)
    .update(req.body.gst_no)
    .update(req.body.admin)
    .digest('hex');
    const generatedHash = await Org.findOne({"generated_hash": hash});
    console.log(useracc);
    if(generatedHash==null && useracc==null) {
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
            subject: 'One Time Password (OTP) for your DigiZip account',
            html: `<div style={{paddingLeft:'20vw', paddingTop:'10vh'}}>
            <br/><br/>Hi <b>${req.body.admin.split('@')[0]},</b><br/><br/>
                Use <b><u>${otp}</u></b> as One Time Password (OTP) for your DigiZip account. <br/><br/><br/><br/><br/>
                Please do not share this OTP with anyone for security reasons. <br/>
            </div>` 
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
        res.status(400).send("Admin already registered or its an User Account");
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

// Update Admin Email
// NOt Tested
const UpdateAdmin = asyncHandler(async (req, res) => {
    const oldad = await Org.findOne({"admin": req.body.oldadmin});
    const userexists = await User.findOne({"email": req.body.newadmin});
    if(oldad && userexists==null){
        oldad.admin = req.body.newadmin;
        oldad.verified_admin = false;
        const otp = otpGenerator.generate(6, { digits: true });
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
            });
        var mailOptions = {
            from: process.env.EMAIL,
            to: req.body.newadmin,
            subject: 'One Time Password (OTP) for your DigiZip account',
            html: `<div style={{paddingLeft:'20vw', paddingTop:'10vh'}}>
            <br/><br/>Hi <b>${req.body.newadmin.split('@')[0]},</b><br/><br/>
                Use <b><u>${otp}</u></b> as One Time Password (OTP) for your DigiZip account. <br/><br/><br/><br/><br/>
                Please do not share this OTP with anyone for security reasons. <br/>
            </div>` 
        };
        transporter.sendMail(mailOptions, async function(error, info){
            if (error) {
                res.status(400).send(error);
            } else {
                console.log('Email sent: ' + info.response);
                await oldad.save();
                res.status(200).send("updated");
            }
        });
    }else{
        res.status(400).send("Admin not found");
    }
});

// Add Account
// Tested
const addAccount = asyncHandler(async (req, res) => {
    const adminCheck = await Org.findOne({"admin": req.body.admin});
    const UserAcc = await User.findOne({"email": req.body.email});
    if(adminCheck && UserAcc==null){
        const accounts = adminCheck.accounts;
        if(!accounts.find(o => o.email == req.body.email)){
        accounts.push({"email": req.body.email, "access_lvl": req.body.access_lvl});
        adminCheck.accounts = accounts;}else{
            res.status(400).send("Account already exists");
        }
        await adminCheck.save();
        res.status(200).send("added");
    }else{
        res.status(400).send("Admin not found or user exists");
    }   
});

// Remove Account
// Tested
const removeAccount = asyncHandler(async (req, res) => {
    const adminCheck = await Org.findOne({"admin": req.body.admin});
    const UserAcc = await User.findOne({"email": req.body.email});
    if(adminCheck && UserAcc==null){
        let accounts = adminCheck.accounts;
        if(accounts.find(o => o.email == req.body.email)){
            accounts = accounts.filter(function( obj ) {
                return obj.email !== req.body.email;
            });
            console.log(accounts);
            adminCheck.accounts = accounts;
        }else{
            res.status(400).send("Account do not exists");
        }
        await adminCheck.save();
        res.status(200).send("removed");
    }else{
        res.status(400).send("Admin not found or user exists");
    }   
})


// make request
// tested
const makeRequest = asyncHandler(async (req, res) => {
    const orgexist = await Org.findOne({"generated_hash": req.body.hash});
    if(orgexist!=null){
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });
        var mailOptions = {
            from: process.env.EMAIL,
            to: req.body.user,
            subject: req.body.subject,
            html: `<div style={{paddingLeft:'20vw', paddingTop:'10vh'}}>
            <br/><br/>Hi <b>${req.body.user},</b><br/><br/>
                ${req.body.message} <br/><br/><br/><br/><br/>
                Organization Code : <b><u>${orgexist.generated_hash}</u></b> <br/>
                Organization Name : <b><u>${orgexist.name}</u></b> <br/>
                please share file on above code and name <br/>
            </div>` 
        };
            
                //VALIDATION OF USER INPUTS
        transporter.sendMail(mailOptions, async function(error, info){
            if (error) {
                res.status(400).send(error);
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).send("sent");
            }
        })
    }else{
        res.status(400).send("org not found");
    }
});

// give user details
// not tested
const getOrgforuser = asyncHandler(async (req, res) => {
    const orgexist = await Org.findOne({"generated_hash": req.query.hash});
    const email = await User.findOne({"email": req.query.email});
    if(orgexist!=null && email!=null){
        const presets = await Preset.find({"orgHash": req.query.hash, "email": req.query.email});
        const getdetails = {presets, orgdetails: {
                "name": orgexist.name,
                "admin": orgexist.admin,
        }}
        res.status(200).send(getdetails);
    }else{
        res.status(400).send("org not found");
    }
});


// Exporting the functions
module.exports = {
    makeOrg,
    getOrg,
    deleteOrg,
    checkOtp,
    addAccount,
    UpdateAdmin,
    removeAccount,
    makeRequest,
    getOrgforuser
}