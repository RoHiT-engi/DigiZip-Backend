const User = require('../models/UserData');
const Preset = require('../models/CustomPresets');
const Org = require('../models/Org');
const File = require('../models/FileData');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');

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
        
        try {
            const arr = preset.files;
            for (let i = 0; i < arr.length; i++) {
                const file = await File.findOne({"CID": arr[i].CID, "metadata.title": arr[i].FileName});
                if(file!=null){
                    file.access.push({
                        org_hash : req.body.orgHash,
                        read : arr[i].accesstype=="read"?true:false,
                        download : arr[i].accesstype=="download"?true:false,
                        time : arr[i].time,
                        importance_lvl : "low",
                        status : false
                    })
                    await file.save();
                }else{
                    res.status(400).send("file not found with name "+arr[i].FileName+" and CID "+arr[i].CID+"");
                }
                arr.splice(i, 1);
            }
            const preset = new Preset({
                "email" : req.body.email,
                "Preset_name" : req.body.Preset_name,
                "files" : req.body.files,
                "description" : req.body.description,
                "orgHash" : req.body.orgHash,
                "generated_hash_preset" : hashValue
            })
            await preset.save();
            res.status(200).send("preset created");
        }catch(e){
            res.status(400).send(e);
        }
    }else{
        res.status(400).send("Preset already exists");
    }
})


// Get all Presets
// Not Tested
const getallPreset = asyncHandler(async (req, res) => {
    try{
    const OrgHash = await Org.findOne({"generated_hash": req.query.orghash});
    if(OrgHash!=null) {
        const Presets = await Preset.find({"orgHash": req.query.orghash});
        res.status(200).send(Presets);
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
// Tested
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
                    file.access.splice(file.access.indexOf(file.access.find(x => x.org_hash == req.query.orghash)), 1);
                    await file.save();
                }
            }
            await Presetbyname.deleteOne({"_id": Presetbyname._id});
            res.status(200).send("Preset deleted");
        }else{
            res.status(400).send("Preset not found");
        }}
    catch(e){
        res.status(400).send(e);
    }
})

module.exports = {addPreset, getallPreset, getPresetByName, deletePreset}