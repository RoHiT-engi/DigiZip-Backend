const File = require('../models/FileData');
const User = require('../models/UserData');
const Org = require('../models/Org');
const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
const Preset = require('../models/CustomPresets');
// AddFile
// Tested
const addfile = asyncHandler(async (req, res) => {
    
  res.header('Access-Control-Allow-Methods', 'POST');
  const CIDexist = await File.findOne({"CID": req.body.file_CID});
  const FileHash = await File.findOne({"FileHash": req.body.FileHash});
  const Email = await User.findOne({"email": req.body.email});
    if(CIDexist==null && FileHash==null && Email!=null) {
        const file = new File({
            email : req.body.email,
            CID : req.body.file_CID,
            FileHash : req.body.FileHash,
            password : req.body.password,
            metadata : {
                title : req.body.metadata.title,
                size : req.body.metadata.size,
                creationDate : req.body.metadata.creationDate,
                lastModifiedDate : req.body.metadata.lastModifiedDate
            },
            access : req.body.access,
        })
        try {
            await file.save();
            res.status(200).send("file created");
        }catch(e){
            res.status(400).send(e);
        }
    }else{
        res.status(400).send("file already exists");
    }

})

// Get Files in curr account
// Tested
const getfiles = asyncHandler(async (req, res) => {
    res.header('Access-Control-Allow-Methods', 'GET');
    try{
    const Email = await User.findOne({"email": req.query.email});
    if(Email!=null) {
        const CIDexist = await File.find({"email": req.query.email});
        res.status(200).send(CIDexist);
    }else{
        res.status(400).send("file not found");
    }}
    catch(e){
        res.status(400).send(e);
    }
})

// DeleteFile
// Tested
const deleteFile = asyncHandler(async (req, res) => {
    // res.header('Access-Control-Allow-Methods', 'DELETE');
    try{
    const email = await User.findOne({"email": req.query.email});
    const FileTitle = await File.find({"email": req.query.email,"CID": req.query.cid});
    if(email!=null && FileTitle!=null){
        try{
            await File.deleteOne({"_id": FileTitle[0]._id});
            res.status(200).send("file deleted");
        }catch(e){  
            res.status(400).send(e);
        }
    }else{
        res.status(400).send("file not found");
    }}
    catch(e){
        res.status(400).send(e);
    }
})

// RevokeAccess
// Tested
const revokeaccess = asyncHandler(async (req, res) => {
    // res.header('Access-Control-Allow-Methods', 'DELETE');
    // console.log(res);
    try{
        const CIDexist = await File.findOne({"CID": req.body.cid});
        console.log(CIDexist);
        if( CIDexist!=null){
            var arr = CIDexist.access;
            for(var i=0;i<arr.length;i++){
                if(arr[i].preset_hash==req.body.hash){
                    const preset = await Preset.findOne({"generated_hash_preset": req.body.hash});
                    if(preset!=null){
                        const files = preset.files;
                        for(var j=0;j<files.length;j++){
                            if(files[j].CID==req.body.cid){
                                files.splice(j,1);
                                break;
                            }
                        }

                        preset.files = files;
                        preset.markModified('files');
                        const org = await Org.findOne({"generated_hash": preset.orgHash});
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.EMAIL,
                                pass: process.env.PASSWORD
                            }
                            });
                            var mailOptions = {
                            from: process.env.EMAIL,
                            to: org.admin,
                            subject: 'User Revoked Access to File '+CIDexist.metadata.title+' in DigiZip',
                            html: `<div style={{paddingLeft:'20vw', paddingTop:'10vh'}}>
                            <br/><br/>Hi <b>${org.admin.split('@')[0]},</b><br/><br/>
                            <b>${CIDexist.email.split('@')[0]}</b> has revoked access to file <b>${CIDexist.metadata.title} from preset named ${preset.Preset_name}</b> in DigiZip.<br/><br/>
                            </div>` 
                            };
                            
                                //VALIDATION OF USER INPUTS
                            transporter.sendMail(mailOptions, async function(error, info){
                            if (error) {
                                res.status(400).send(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                                await preset.save();
                            }
                            });
                    }
                    arr.splice(i,1);
                    break;
                }
            }
            CIDexist.access = arr;
            await CIDexist.save();
            res.status(200).send("access revoked");
        }else{
            res.status(400).send("file not found");
        }
    }catch(e){
        res.status(400).send(e);
    }
})

// GetAccess granted Files for an Org
// Tested
const getAccessFiles = asyncHandler(async (req, res) => {
    // res.header('Access-Control-Allow-Methods', 'GET');
    try{
        const org = await Org.findOne({"generated_hash": req.query.hash});
        const File_cid = await File.find({"access.org_hash": req.query.hash});
        if(org!=null && File_cid!=null){
            res.status(200).send(File_cid);
        }else{
            res.status(400).send("file not found");
        }
    }catch(e){
        res.status(400).send(e);
    }
})

// Grant Access
// Tested
const grantAccess = asyncHandler(async (req, res) => {
    // res.header('Access-Control-Allow-Methods', 'POST');
    try{
        const org = await Org.findOne({"generated_hash": req.body.hash});
        const File_cid = await File.findOne({"CID": req.body.file_CID});
        const check = await File.findOne({"CID": req.body.file_CID,"access.org_hash": req.body.hash});
        if(org!=null && File_cid!=null && check==null){
            var arr = File_cid.access;
            arr.push({
                "org_hash": req.body.hash,
                "read": req.body.read,
                "download" : req.body.download,
                "time": req.body.time,
                "importance_lvl" : req.body.importance_lvl,
                "status": req.body.status
            });
            File_cid.access = arr;
            await File_cid.save();
            res.status(200).send("access granted");
        }else{
            res.status(400).send("file not found or access already granted");
        }

    }catch(e){
        res.status(400).send(e);
    }
})

// Edit File
// tested
const editFile = asyncHandler(async (req, res) => {
    // res.header('Access-Control-Allow-Methods', 'PUT');
    try{
        const userExists = await User.findOne({"email": req.body.email});
        const FileExist = await File.findOne({"CID": req.body.cid_old});
        if(userExists!=null && FileExist!=null){
            FileExist.CID = req.body.cid_new;
            FileExist.FileHash = req.body.FileHash;
            FileExist.metadata.size = req.body.size;
            const access = FileExist.access;
            for(var i=0;i<access.length;i++){
                const preset = await Preset.findOne({"generated_hash_preset": access[i].preset_hash});
                if(preset!=null){
                    const preset_access = preset.files;
                    for(var j=0;j<preset_access.length;j++){
                        if(preset_access[j].CID==req.body.cid_old){
                            preset_access[j].CID = req.body.cid_new;
                            preset.files = preset_access;
                            var transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: process.env.EMAIL,
                                    pass: process.env.PASSWORD
                            }});
                            const getorg = await Org.findOne({"generated_hash": preset.orgHash});
                                var mailOptions = {
                                    from: process.env.EMAIL,
                                    to: getorg.admin,
                                    subject: 'Modification in Preset',
                                    html: `<div style={{paddingLeft:'20vw', paddingTop:'10vh'}}>
                                    <br/><br/>Hi <b>${getorg.admin},</b><br/><br/>
                                    <b>${userExists.email}</b> has modified the file <b>${FileExist.metadata.title}</b> in the preset <b>${preset.Preset_name}</b> of your organization <b>${getorg.name}</b>.<br/><br/>
                                    <br/><br/><br/><br/><br/>
                                    </div>` 
                                };
                            transporter.sendMail(mailOptions, async function(error, info){
                                if (error) {
                                  res.status(400).send(error);
                                } else {
                                  console.log('Email sent: ' + info.response);
                                }
                              })
                            break;
                        }
                    }
                    preset.markModified('files');
                    await preset.save();
                }
            }
            FileExist.markModified('CID')
            await FileExist.save();
            res.status(200).send("file edited");
        }else{
            res.status(400).send("file not found");
        }
    }catch(e){
        res.status(400).send(e);
    }
})
module.exports = {addfile,editFile, getfiles, deleteFile, revokeaccess, getAccessFiles, grantAccess}

