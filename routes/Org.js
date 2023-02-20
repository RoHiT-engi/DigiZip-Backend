const express = require('express')
const router  = express.Router();
const {makeOrg,
    getOrg,
    deleteOrg,checkOtp} = require('../middleware/OrgMiddleware');


// not tested

router.route('/make').post(makeOrg)
router.route('/get').get(getOrg);
router.route('/del').delete(deleteOrg);
router.route('/checkotp').post(checkOtp);




module.exports = router;


