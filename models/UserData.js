
const Mongoose = require("mongoose");


const UserSchema = new Mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        ref: 'User',
    },
    aadhaar: {
        type: String,
        required: true,
        unique: true,
        ref: 'User',
    },
    verified: {
        type: Boolean,
        required: true,
        ref: 'User',
    },
    otp: {
        type: String,
        required: true,
        ref: 'User',
    }
},{
    timestamps: true,
  });

const User = Mongoose.model('User', UserSchema);
module.exports =  User;