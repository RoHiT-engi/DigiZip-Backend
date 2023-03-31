const Mongoose = require("mongoose");


const KeyValueOrgHashSchema = new Mongoose.Schema({
    org_hash: {
        type: String,
        required: true,
        unique: true,
        ref: 'KeyValueOrgHash',
    },
    random_key: {
        type: String,
        required: true,
        unique: true,
        ref: 'KeyValueOrgHash',
    }
});


const KeyValueHash = Mongoose.model('KeyValueOrgHash', KeyValueOrgHashSchema);
module.exports =  KeyValueHash;