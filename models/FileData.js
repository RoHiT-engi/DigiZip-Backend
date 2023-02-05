
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
        ref: 'File',
    },
    FileHash: {
        type: String,
        required: true,
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
        email :{
            type: String,
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
            type: Number,
            ref: 'File',
            default: 0
        },
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