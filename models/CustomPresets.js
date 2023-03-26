
const Mongoose = require("mongoose");


const PresetSchema = new Mongoose.Schema({
    email: {
        type: String,
        required: true,
        ref: 'Preset',
    },
    files: {
        type: Array,
        ref: 'Preset',
        CID :{
            type: String,
            ref: 'Preset',
        },
        FileName :{
            type: String,
            ref: 'Preset',
        },
        accesstype :{
            type: String,
            ref: 'Preset',
            default: 'read'
        },
    },
    time: {
        type: String,
        ref: 'Preset',
        default: 0
    },
    Preset_name: {
        type: String,
        required: true,
        ref: 'Preset',
    },
    description: {
        type: String,
        ref: 'Preset',
        required: true,
    },
    orgHash: {
        type: String,
        ref: 'Preset',
        required: true,
    },
    generated_hash_preset: {
        type: String,
        ref: 'Preset',
        required: true,
    }
},{
    timestamps: true,
  });

const Preset = Mongoose.model('Preset', PresetSchema);
module.exports =  Preset;