const express = require('express')
const router  = express.Router();
// const User = require('..//models/UserData')
const Joi = require("@hapi/joi");
const {adduser, checkotp, getuser,deleteuser} = require('../middleware/UserMiddleware')
const registerSchema = Joi.object({
    email : Joi.string().email().required(),
    aadhaar : Joi.string().min(12).max(12).required(),
})


router.route('/register').post(adduser)
router.route('/getuser').get(getuser);
router.route('/check').post(checkotp);
router.route('/del').delete(deleteuser);

// router.post('/check',

// router.get('/get', 




module.exports = router;


