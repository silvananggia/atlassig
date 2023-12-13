const router = require('express-promise-router')();
const fktpController = require('../controllers/fktp.controller');



router.get('/fktp-list', fktpController.listFktp)
router.get('/fktp/:lat/:lon', fktpController.listAllFktp)
router.get('/fktp/:id', fktpController.detailFKTP);

//listCabangFKTP
router.get('/fktp-cabang/:id', fktpController.listCabangFKTP);
router.get('/fktp-kedeputian/:id', fktpController.listKedeputianFKTP);


module.exports = router;