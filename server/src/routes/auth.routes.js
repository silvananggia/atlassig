const router = require('express-promise-router')();
const authController = require('../controllers/auth.controller');


router.post('/register', authController.Register);
router.post('/login', authController.Login);
router.post('/logout', authController.Logout);
router.get('/checkAuth', authController.checkAuth);
router.get('/checkAuthEmbed', authController.checkAuthEmbed);

module.exports = router;