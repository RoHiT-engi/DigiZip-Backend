
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
        }
    },
    Preset_name: {
        type: String,
        required: true,
        ref: 'Preset',
    },
    description: {
        type: Array,
        ref: 'Preset',
        Key :{
            type: String,
            ref: 'Preset',
        },
        Value :{
            type: String,
            ref: 'Preset',
        }
    }
},{
    timestamps: true,
  });

const Preset = Mongoose.model('Preset', PresetSchema);
module.exports =  Preset;