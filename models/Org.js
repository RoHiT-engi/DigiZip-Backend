
const Mongoose = require("mongoose");


const OrgSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true,
        ref: 'Org',
    },
    gst_no: {
        type: String,  
        required: true,
        ref: 'Org',
    },
    admin: {
        type: String,
        required: true,
        ref: 'Org',
    },
    accounts: {
        type: Array,
        ref: 'Org',
        default: [],
        email :{
            type: String,
            ref: 'Org',
        },
        access_lvl :{
            type: String,
            ref: 'Org',
            default: 'low'
        }
    },
    verified: {
        type: Boolean,
        required: true,
        default: false,
        ref: 'Org',
    },
    generated_hash: {
        type: String,
        required: true,
        ref: 'Org',
    },
    otp: {
        type: String,
        ref: 'Org',
        required: true,
    }
},{
    timestamps: true,
  });

const Org = Mongoose.model('Org', OrgSchema);
module.exports =  Org;