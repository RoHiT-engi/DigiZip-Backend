const express = require('express')
const router  = express.Router();
// const User = require('..//models/UserData')
const {addfile, getfiles, deleteFile, revokeaccess, getAccessFiles, grantAccess} = require('../middleware/FilesMiddleware')


router.route('/add').post(addfile)  // Tested
router.route('/get').get(getfiles);   // Tested
router.route('/del').delete(deleteFile);  // Tested
router.route('/revoke').post(revokeaccess);  // Tested
router.route('/getAccessFiles').get(getAccessFiles);  //Tested
router.route('/grant').post(grantAccess); // Tested


// router.post('/check',

// router.get('/get', 




module.exports = router;


