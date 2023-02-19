const File = require('../models/FileData');
const User = require('../models/UserData');
const asyncHandler = require('express-async-handler');

// AddFile
// Tested
const addfile = asyncHandler(async (req, res) => {
    
  res.header('Access-Control-Allow-Methods', 'POST');
  const CIDexist = await File.findOne({"CID": req.body.file_CID});
  const FileHash = await File.findOne({"FileHash": req.body.FileHash});
  const FileTitle = await File.find({"email": req.body.email,"metadata.title": req.body.metadata.title});
  const Email = await User.findOne({"email": req.body.email});

    if(CIDexist!=null || FileHash!=null || Email!=null || FileTitle!=null) {
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

// GetFiles
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
    const FileTitle = await File.find({"email": req.query.email,"metadata.title": req.query.title});
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
        const email = await User.findOne({"email":req.body.email});
        const CIDexist = await File.findOne({"CID": req.body.file_CID});
        if(email!=null && CIDexist!=null){
            var arr = CIDexist.access;
            for(var i=0;i<arr.length;i++){
                if(arr[i].email==req.body.email){
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

// GetAccessFiles
// NOT Tested
const getAccessFiles = asyncHandler(async (req, res) => {
    // res.header('Access-Control-Allow-Methods', 'GET');
    try{
        const Email = User.findOne({"email": req.query.email});
        const File_cid = File.find({"access": {$all: [{"email": req.query.email}]}});
        if(Email!=null && File_cid!=null){
            res.status(200).send(File_cid);
        }else{
            res.status(400).send("file not found");
        }
    }catch(e){
        res.status(400).send(e);
    }
})

// Grant Access
// NOT Tested
const grantAccess = asyncHandler(async (req, res) => {
    // res.header('Access-Control-Allow-Methods', 'POST');
    try{
        const Email = User.findOne({"email": req.body.email});
        const File_cid = File.findOne({"CID": req.body.file_CID});
        if(Email!=null && File_cid!=null){
            var arr = File_cid.access;
            arr.push({
                "email": req.body.email,
                "read": req.body.read,
                "download" : req.body.download,
                "time": req.body.time
            });
            File_cid.access = arr;
            await File_cid.save();
            res.status(200).send("access granted");
        }else{
            res.status(400).send("file not found");
        }

    }catch(e){
        res.status(400).send(e);
    }
})
module.exports = {addfile, getfiles, deleteFile, revokeaccess}

