import Mongoose from "mongoose";

const AdhaarSchema = new Mongoose.Schema({
    phoneno: {
        type: Integer,
        required: true,
        ref: 'Adhaar',
    },
    aadhaar: {
        type: String,
        required: true,
        ref: 'Adhaar',
    },
},{
    timestamps: true,
  });

const User = Mongoose.model('Adhaar', AdhaarSchema);
export default User;