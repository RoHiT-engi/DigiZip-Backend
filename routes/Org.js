const express = require('express')
const router  = express.Router();
const {makeOrg,
    getOrg,
    deleteOrg,checkOtp} = require('../middleware/OrgMiddleware');


// not tested

router.route('/make').post(makeOrg)   // tested
router.route('/get').get(getOrg);  // tested
router.route('/del').delete(deleteOrg);     // tested
router.route('/checkotp').post(checkOtp);   // tested




module.exports = router;


