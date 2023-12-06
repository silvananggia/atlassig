const router = require('express-promise-router')();
const fkrtlController = require('../controllers/fkrtl.controller');


router.post('/fkrtl', fkrtlController.createProduct);


router.get('/fkrtl', fkrtlController.listAllFkrtl);


router.get('/fkrtl/:id', fkrtlController.findProductById);


router.put('/fkrtl/:id', fkrtlController.updateProductById);


router.delete('/fkrtl/:id', fkrtlController.deleteProductById);

module.exports = router;