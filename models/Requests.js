
const Mongoose = require("mongoose");


const RequestSchema = new Mongoose.Schema({
    sent_from_email: {
        type: String,
        required: true,
        ref: 'Request',
    },
    sent_to_email: {
        type: String,
        required: true,
        ref: 'Request',
    },
    title: {
        type: String,
        required: true,
        ref: 'Request',
    },
    body: {
        type: Boolean,
        required: true,
        ref: 'Request',
    }
},{
    timestamps: true,
  });

const Request = Mongoose.model('Request', RequestSchema);
module.exports =  Request;