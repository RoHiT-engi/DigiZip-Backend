
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
    metadata: {
        title :{
            type: String,
            required: true,
            ref: 'File',
        },
        size :{
            type: String,
            required: true,
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
            ref: 'File',
        }
    }
},{
    timestamps: true,
  });

const File = Mongoose.model('File', FileSchema);
module.exports =  File;