const router = require('express-promise-router')();
const fktpController = require('../controllers/fktp.controller');

// ==> Definindo as rotas do CRUD - 'Product':

// ==> Rota responsável por criar um novo 'Product': (POST): localhost:3000/api/products
router.post('/fktp', fktpController.createProduct);

// ==> Rota responsável por listar todos os 'Products': (GET): localhost:3000/api/products
router.get('/fktp', fktpController.listAllFktp);

// ==> Rota responsável por selecionar 'Product' pelo 'Id': (GET): localhost:3000/api/products/:id
router.get('/fktp/:id', fktpController.findProductById);

// ==> Rota responsável por atualizar 'Product' pelo 'Id': (PUT): localhost: 3000/api/products/:id
router.put('/fktp/:id', fktpController.updateProductById);

// ==> Rota responsável por excluir 'Product' pelo 'Id': (DELETE): localhost:3000/api/products/:id
router.delete('/fktp/:id', fktpController.deleteProductById);

module.exports = router;