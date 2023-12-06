const router = require('express-promise-router')();
const fktpController = require('../controllers/fktp.controller');




router.get('/fktp', fktpController.listAllFktp);



module.exports = router;