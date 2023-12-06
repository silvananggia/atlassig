const router = require('express-promise-router')();
const authController = require('../controllers/auth.controller');


router.post('/register', authController.register);


module.exports = router;