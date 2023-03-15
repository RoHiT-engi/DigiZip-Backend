const File = require('../models/FileData');
const User = require('../models/UserData');
const Org = require('../models/Org');
const asyncHandler = require('express-async-handler');

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
        const chash = await Org.findOne({"generated_hash": req.body.hash});
        if( CIDexist!=null && chash!=null){
            var arr = CIDexist.access;
            for(var i=0;i<arr.length;i++){
                if(arr[i].org_hash==req.body.hash){
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
        console.log(File_cid+" "+org);
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
        console.log(userExists+" "+FileExist);
        if(userExists!=null && FileExist!=null){
            FileExist.CID = req.body.cid_new;
            FileExist.FileHash = req.body.FileHash;
            FileExist.metadata.size = req.body.size;
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

