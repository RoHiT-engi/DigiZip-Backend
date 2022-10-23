import Mongoose from "mongoose";

const UserSchema = new Mongoose.Schema({
    email: {
        type: String,
        required: true,
        ref: 'User',
    },
    aadhaar: {
        type: String,
        required: true,
        ref: 'User',
    },
},{
    timestamps: true,
  });

const User = Mongoose.model('User', UserSchema);
export default User;