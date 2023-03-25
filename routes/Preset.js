const express = require('express')
const router  = express.Router();
const {addPreset, getallPreset, getPresetByName, deletePreset,removeFileFromPreset} = require('../middleware/CustomPresetMiddleware')


router.route('/add').post(addPreset)
router.route('/getPresets').get(getallPreset);
router.route('/getPresetByName').get(getPresetByName);
router.route('/del').delete(deletePreset);
router.route('/removeFileFromPreset').delete(removeFileFromPreset);





module.exports = router;


