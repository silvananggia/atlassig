const router = require('express-promise-router')();
const filterController = require('../controllers/filter.controller');


router.get('/list-canggih', filterController.listCanggih);
router.get('/list-jenis-fktp', filterController.listJenisFKTP);
router.get('/list-jenis-fkrtl', filterController.listJenisFKRTL);


router.get('/bbox-kabupaten/:id', filterController.bboxKabupaten);
router.get('/bbox-cabang/:id', filterController.bboxCabang);
router.get('/bbox-kedeputian/:id', filterController.bboxKedeputian);
router.get('/center-cabang/:id', filterController.centerCabang);
router.get('/center-kedeputian/:id', filterController.centerKedeputian);


router.get('/autowilayah/:id', filterController.autowilayah);
router.get('/wilayahadmin/:pro/:kab/:kec', filterController.wilayahadmin);
router.get('/wilayahadmin-canggih/:pro/:kab/:kec/:id', filterController.wilayahadminCanggih);
router.get('/filter-fktp/:pro/:kab/:kec/:kdkc/:kddep/:rmax/:rmin/:nmppk/:alamatppk', filterController.filterFKTP);
router.get('/filter-fkrtl/:pro/:kab/:kec/:kdkc/:kddep/:krs/:canggih/:nmppk/:alamatppk', filterController.filterFKTP);




module.exports = router;