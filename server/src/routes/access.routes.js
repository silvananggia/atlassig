const router = require('express-promise-router')();
const accessController = require('../controllers/access.controller');


router.get('/getAccess', accessController.getAccess);
router.get('/getEmbed/:token', accessController.getEmbed);



module.exports = router;