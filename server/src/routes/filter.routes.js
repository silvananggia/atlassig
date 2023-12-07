const router = require('express-promise-router')();
const filterController = require('../controllers/filter.controller');



router.get('/bbox-kabupaten/:id', filterController.bboxKabupaten);
router.get('/bbox-cabang/:id', filterController.bboxCabang);
router.get('/center-cabang/:id', filterController.centerCabang);


module.exports = router;