const User = require('../models/UserData');
const Preset = require('../models/CustomPresets');
const asyncHandler = require('express-async-handler');

const addPreset = asyncHandler(async (req, res) => {
    const email = User.findOne({"email": req.body.email});
    const Name_Exist = Preset.findOne({"email": req.body.email, "Preset_name": req.body.Preset_name});
    if(email!=null || Name_Exist==null) {
        const preset = new Preset({
            email : req.body.email,
            Preset_name : req.body.Preset_name,
            files : req.body.files,
            description : req.body.description
        })
        try {
            await preset.save();
            res.status(200).send("preset created");
        }catch(e){
            res.status(400).send(e);
        }
    }else{
        res.status(400).send("user not found");
    }
})

const getallPreset = asyncHandler(async (req, res) => {
    try{
    const Email = await User.findOne({"email": req.query.email});
    console.log(Email);
    if(Email!=null) {
        const Presets = await Preset.findOne({"email": req.query.email});
        res.status(200).send(Presets);
    }else{
        res.status(400).send("user not found");
    }}
    catch(e){
        res.status(400).send(e);
    }
})

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

const deletePreset = asyncHandler(async (req, res) => {
    try{
        const Email = await User.findOne({"email": req.query.email});
        const Presetbyname = await Preset.findOne({"email": req.query.email, "Preset_name": req.query.Preset_name});
        console.log(Presetbyname);
        if(Email!=null || Presetbyname!=null) {
            await Preset.deleteOne({"_id": Presetbyname._id});
            res.status(200).send("Presetbyname deleted");
        }else{
            res.status(400).send("user not found");
        }}
    catch(e){
        res.status(400).send(e);
    }
})

module.exports = {addPreset, getallPreset, getPresetByName, deletePreset}