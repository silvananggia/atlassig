const router = require('express-promise-router')();
const fkrtlController = require('../controllers/fkrtl.controller');



router.get('/fkrtl/:lat/:lon', fkrtlController.listAllFkrtl);
router.get('/fkrtl/:id', fkrtlController.detailFKRTL);

//listCabangFKRTL
router.get('/fkrtl-cabang/:id', fkrtlController.listCabangFKRTL);


module.exports = router;