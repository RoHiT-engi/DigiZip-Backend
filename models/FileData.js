
const Mongoose = require("mongoose");


const FileSchema = new Mongoose.Schema({
    email: {
        type: String,
        required: true,
        ref: 'File',
    },
    CID: {
        type: String,
        required: true,
        unique: true,
        ref: 'File',
    },
    FileHash: {
        type: String,
        required: true,
        unique: true,
        ref: 'File',
    },
    password: {
        type: String,
        required: true,
        ref: 'File',
    },
    access: {
        type : Array,
        ref: 'File',
        org_hash :{
            type: String,
            unique: true,
            ref: 'File',
        },
        read :{
            type: Boolean,
            ref: 'File',
            default: false
        },
        download :{
            type: Boolean,
            ref: 'File',
            default: false
        },
        time: {
            type: String,
            ref: 'File',
            default: 0
        },
        importance_lvl: {
            type: String,
            ref: 'File',
            default: 'low'
        },
        status :{
            type: Boolean,
            ref: 'File',
            default: false
        },
        preset_hash :{
            type: String,
            ref: 'File',
            default: 'Not Available'
        }
    },
    metadata: {
        title :{
            type: String,
            required: true,
            ref: 'File',
        },
        size :{
            type: Number,
            required: true,
            default: 0,
            ref: 'File',
        },
        creationDate :{
            type: String,
            required: true,
            ref: 'File',
        },
        lastModifiedDate :{
            type: String,
            required: true,
            default: 'Not Available',
            ref: 'File',
        }
    }
},{
    timestamps: true,
  });

const File = Mongoose.model('File', FileSchema);
module.exports =  File;