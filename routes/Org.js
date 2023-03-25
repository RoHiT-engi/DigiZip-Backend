const express = require('express')
const router  = express.Router();
const {makeOrg,
    getOrg,
    deleteOrg,checkOtp,UpdateAdmin,addAccount,removeAccount,makeRequest} = require('../middleware/OrgMiddleware');


// not tested

router.route('/make').post(makeOrg)   // tested
router.route('/get').get(getOrg);  // tested
router.route('/del').delete(deleteOrg);     // tested
router.route('/checkotp').post(checkOtp);   // tested
router.route('/updateadmin').post(UpdateAdmin);   // tested
router.route('/addaccount').post(addAccount);   //  tested
router.route('/removeaccount').post(removeAccount);   //  tested
router.route('/makerequest').post(makeRequest);   //  tested


module.exports = router;


