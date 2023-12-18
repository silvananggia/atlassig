const router = require('express-promise-router')();
const createExpression = require('path-to-regexp');
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
router.get('/get-cabang/:id', filterController.getCabang);
router.get('/wilayahadmin/:pro/:kab/:kec', filterController.wilayahadmin);
router.get('/wilayahadmin-canggih/:pro/:kab/:kec/:id', filterController.wilayahadminCanggih);
router.get('/filter-fktp/:pro/:kab/:kec/:kdkc/:kddep/:rmax/:rmin/:jenis/:nmppk/:alamatppk', filterController.filterTitikFKTP);
router.get('/filter-fkrtl/:pro/:kab/:kec/:kdkc/:kddep/:krs/:canggih/:jenis/:nmppk/:alamatppk', filterController.filterTitikFKRTL);
 

router.get('/filter-fktp-list/:pro/:kab/:kec/:kdkc/:kddep/:rmax/:rmin/:jenis/:nmppk/:alamatppk', filterController.filterFKTP);
router.get('/filter-fkrtl-list/:pro/:kab/:kec/:kdkc/:kddep/:krs/:canggih/:jenis/:nmppk/:alamatppk', filterController.filterFKRTL);

//countJenisFKRTL
router.get('/count-jenis-fkrtl/:pro/:kab/:kec/:kdkc/:kddep', filterController.countJenisFKRTL);
router.get('/count-jenis-fktp/:pro/:kab/:kec/:kdkc/:kddep', filterController.countJenisFKTP);

router.get('/count-fkrtl/:pro/:kab/:kec/:kdkc/:kddep', filterController.countFKRTL);
router.get('/count-fktp/:pro/:kab/:kec/:kdkc/:kddep', filterController.countFKTP);

module.exports = router;