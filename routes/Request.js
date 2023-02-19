const express = require('express')
const router  = express.Router();
const {makeReq,
    getallReqSent,
    getallReqReceived} = require('../middleware/RequestMiddleware')


// not tested

router.route('/makereq').post(makeReq)
router.route('/getsent').get(getallReqSent);
router.route('/getReceive').get(getallReqReceived);





module.exports = router;


