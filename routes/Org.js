const express = require('express')
const router  = express.Router();
const {makeOrg,
    getOrg,
    deleteOrg,checkOtp,UpdateAdmin,addAccount,removeAccount} = require('../middleware/OrgMiddleware');


// not tested

router.route('/make').post(makeOrg)   // tested
router.route('/get').get(getOrg);  // tested
router.route('/del').delete(deleteOrg);     // tested
router.route('/checkotp').post(checkOtp);   // tested
router.route('/updateadmin').post(UpdateAdmin);   // tested
router.route('/addaccount').post(addAccount);   //  tested
router.route('/removeaccount').post(removeAccount);   //  tested


module.exports = router;


