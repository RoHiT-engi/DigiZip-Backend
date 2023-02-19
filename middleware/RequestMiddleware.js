const User = require('../models/UserData');
const Request = require('../models/Requests');
const asyncHandler = require('express-async-handler');

// make request
// not tested
const makeReq = asyncHandler(async (req, res) => {
    const fromemail = User.findOne({"email": req.body.sent_from_email});
    const toemail = User.findOne({"email": req.body.sent_to_email});
    if(fromemail!=null && toemail!=null) {
        try{
            const request = new Request({
                "sent_from_email": req.body.sent_from_email,
                "sent_to_email": req.body.sent_to_email,
                "title": req.body.title,
                "body": req.body.body
            })
            await request.save();
            res.status(200).send("request sent");
        }catch(e){
            res.status(400).send(e);
        }
    }else{
        res.status(400).send("user not found");
    }
});

// get all requests sent by an email
// not tested
const getallReqSent = asyncHandler(async (req, res) => {
    try{
        const email = User.findOne({"email": req.body.email});
        if(email!=null) {
            const getall = Request.find({"sent_from_email": req.body.email});
            res.status(200).send(getall);
        }else{
            res.status(400).send("user not found");
        }
    }catch(e){
        res.status(400).send(e);
    }
});


// get all requests received to an email
// not tested
const getallReqReceived = asyncHandler(async (req, res) => {
    try{
        const email = User.findOne({"email": req.body.email});
        if(email!=null) {
            const getall = Request.find({"sent_to_email": req.body.email});
            res.status(200).send(getall);
        }else{
            res.status(400).send("user not found");
        }

    }catch(e){
        res.status(400).send(e);
    }

})

module.exports = {
    makeReq,
    getallReqSent,
    getallReqReceived
}