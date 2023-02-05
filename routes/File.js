const express = require('express')
const router  = express.Router();
// const User = require('..//models/UserData')
const {addfile, getfiles, deleteFile, revokeaccess} = require('../middleware/FilesMiddleware')


router.route('/add').post(addfile)
router.route('/getFiles').get(getfiles);
router.route('/del').delete(deleteFile);
router.route('/revoke').post(revokeaccess);


// router.post('/check',

// router.get('/get', 




module.exports = router;


