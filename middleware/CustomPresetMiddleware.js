const User = require('../models/UserData');
const Preset = require('../models/CustomPresets');
const Org = require('../models/Org');
const File = require('../models/FileData');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
// Add Preset
// Tested
const addPreset = asyncHandler(async (req, res) => {
    const email = await User.findOne({"email": req.body.email});
    const Name_Exist = await Preset.findOne({"email": req.body.email, "Preset_name": req.body.Preset_name,"orgHash" : req.body.orgHash});
    const orgexist = await Org.findOne({"generated_hash": req.body.orgHash});
    if((email!=null && orgexist!=null) || Name_Exist==null) {
        const hashValue = crypto.createHash('sha256', req.body.email)
            .update(req.body.Preset_name)
            .update(req.body.orgHash)
            .digest('hex');

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
        }});
            var mailOptions = {
                from: process.env.EMAIL,
                to: orgexist.admin,
                subject: 'DigiZip - Access Granted to Files',
                html: `<div style={{paddingLeft:'20vw', paddingTop:'10vh'}}>
                <br/><br/>Hi <b>${orgexist.admin},</b><br/><br/>
                <p>Access to the files has been granted to your organization with the preset name ${ req.body.Preset_name} by ${req.body.email}</p>
                <p>Files are available at <a href="https://digizip.vercel.app/">DigiZip</a></p>
                <br/><br/><br/><br/><br/>
                </div>` 
            };
        try {
            const presetExist = await Preset.findOne({"generated_hash_preset": hashValue});
            if(presetExist==null){
                transporter.sendMail(mailOptions, async function(error, info){
                    if (error) {
                      res.status(400).send(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                      const arr = req.body.files;
                        for (let i = 0; i < arr.length; i++) {
                            const file = await File.findOne({"CID": arr[i].CID});
                            if(file!=null){
                                file.access.push({
                                    org_hash : req.body.orgHash,
                                    read : arr[i].accesstype=="read"?true:false,
                                    download : arr[i].accesstype=="download"?true:false,
                                    time : req.body.time,
                                    importance_lvl : "low",
                                    status : false,
                                    preset_hash : hashValue
                                })
                                await file.save();
                            }else{
                                res.status(400).send("file not found with name "+arr[i].FileName+" and CID "+arr[i].CID+"");
                            }
                            // arr.splice(i, 1);
                        }
                      const preset = new Preset({
                        "email" : req.body.email,
                        "Preset_name" : req.body.Preset_name,
                        "files" : req.body.files,
                        "description" : req.body.description,
                        "orgHash" : req.body.orgHash,
                        "time" : req.body.time,
                        "generated_hash_preset" : hashValue
                        })
                        await preset.save();
                        res.status(200).send("preset created");
                    }
                  });
            }else{
                res.status(400).send("preset already exists");
            }
        }catch(e){
            res.status(400).send(e);
        }
    }else{
        res.status(400).send("Org does not exists or preset already exists");
    }
})


// Get all Presets
// Tested
const getallPreset = asyncHandler(async (req, res) => {
    try{
    const OrgHash = await Org.findOne({"generated_hash": req.query.orghash});
    if(OrgHash!=null) {
        const Presets = await Preset.find({"orgHash": req.query.orghash});
        for (let index = 0; index <Presets.length; index++) {
            const element = Presets[index];
            const today = new Date();
            const selected = new Date(element.time);
            // console.log(element.time+" "+today);
            if(selected<=today){
            const files = element.files;
            for (let i = 0; i < files.length; i++) {
                const file = await File.findOne({"CID": files[i].CID});
                if(file!=null){
                    const access = file.access;
                    for (let j = 0; j < access.length; j++) {
                        const inner_element = access[j];
                        if(inner_element.preset_hash==element.generated_hash_preset){
                            access.splice(j, 1);
                            break;
                        }
                    }
                    file.access = access;
                    await file.save();
                }
            }
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
            }});
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: OrgHash.admin,
                    subject: 'Your Access to Files has been Expired',
                    html: `<div style={{paddingLeft:'20vw', paddingTop:'10vh'}}>
                    <br/><br/>Hi <b>${OrgHash.admin},</b><br/><br/>
                    <p>Your access to the files has been expired with the preset name ${ element.Preset_name} by ${element.email}</p>
                    <br/><br/><br/><br/><br/>
                    </div>` 
                };
            transporter.sendMail(mailOptions, async function(error, info){
                if (error) {
                    res.status(400).send(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    await element.delete();
                }
              })
            }
        }
        res.status(200).send(await Preset.find({"orgHash": req.query.orghash}));
    }else{
        res.status(400).send("Organization does not exists");
    }}
    catch(e){
        res.status(400).send(e);
    }
})

// Get Preset by name
// Not Tested
// not in use maybe in future
const getPresetByName = asyncHandler(async (req, res) => {
    try{
    const Email = await User.findOne({"email": req.query.email});
    if(Email!=null) {
        const Presetbyname = await Preset.findOne({"email": req.query.email, "Preset_name": req.query.Preset_name});
        res.status(200).send(Presetbyname);
    }else{
        res.status(400).send("user not found");
    }}
    catch(e){
        res.status(400).send(e);
    }
})

// Delete Preset by name
// Not Tested
const deletePreset = asyncHandler(async (req, res) => {
    try{
        // const Email = await User.findOne({"email": req.query.email});
        const Presetbyname = await Preset.findOne({"generated_hash_preset": req.query.hash});
        console.log(Presetbyname);
        if(Presetbyname!=null) {
            const getfiles = Presetbyname.files;
            for (let i = 0; i < getfiles.length; i++) {
                const file = await File.findOne({"CID": getfiles[i].CID, "metadata.title": getfiles[i].FileName});
                if(file!=null){
                    file.access.splice(file.access.indexOf(file.access.find(x => x.preset_hash == Presetbyname.generated_hash_preset)), 1);
                    await file.save();
                }
            }
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
            }});
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: Presetbyname.email,
                    subject: 'DigiZip - Deleting Preset Granted by you on '+Presetbyname.createdAt,
                    html: `<div style={{paddingLeft:'20vw', paddingTop:'10vh'}}>
                    <br/><br/>Hi <b>${Presetbyname.email},</b><br/><br/>
                    <p>Access to the preset has been <b>rejected</b> by organization with the preset name ${ Presetbyname.Preset_name} </p>
                    <p>Message from organization :<br/> ${req.query.des}</p>
                    <br/><br/><br/><br/><br/>
                    </div>` 
                };
            transporter.sendMail(mailOptions, async function(error, info){
                if (error) {
                  res.status(400).send(error);
                } else {
                  console.log('Email sent: ' + info.response);
                  await Presetbyname.deleteOne({"_id": Presetbyname._id});
                    res.status(200).send("Preset deleted");
                }
              })
            
        }else{
            res.status(400).send("Preset not found");
        }}
    catch(e){
        res.status(400).send(e);
    }
})

// Remove a File from Preset
// Tested
const removeFileFromPreset = asyncHandler(async (req, res) => {
    try{
        const OrgHash = await Org.findOne({"generated_hash": req.query.orghash});
        const getpreset = await Preset.findOne({"generated_hash_preset": req.query.prehash});
        if(OrgHash!=null && getpreset!=null) {
            const getfiles = getpreset.files;
            for (let i = 0; i < getfiles.length; i++) {
                if(getfiles[i].CID==req.query.CID){
                    const file = await File.findOne({"CID": getfiles[i].CID});
                    if(file!=null){
                        file.access.splice(file.access.indexOf(file.access.find(x => x.preset_hash == getpreset.generated_hash_preset)), 1);
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.EMAIL,
                                pass: process.env.PASSWORD
                        }});
                            var mailOptions = {
                                from: process.env.EMAIL,
                                to: file.email,
                                subject: 'File has been removed from Preset',
                                html: `<div style={{paddingLeft:'20vw', paddingTop:'10vh'}}>
                                <br/><br/>Hi <b>${file.email},</b><br/><br/>
                                <p>File has been removed from Preset by organization with the preset name ${ getpreset.Preset_name} </p>
                                <br/><br/><br/><br/><br/>
                                </div>` 
                            };
                            transporter.sendMail(mailOptions, async function(error, info){
                                if (error) {
                                  res.status(400).send(error);
                                } else {
                                  console.log('Email sent: ' + info.response);
                                  file.markModified('access');
                                  await file.save();
                                }
                              });
                    }
                    getfiles.splice(i, 1);
                }
            }
            await getpreset.save();
            res.status(200).send("File removed from preset");
        }else{
            res.status(400).send("Organization or Preset does not exists");
        }
    }catch(e){
        res.status(400).send(e);
    }
})

module.exports = {addPreset, getallPreset, getPresetByName, deletePreset,removeFileFromPreset}