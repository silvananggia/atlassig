const router = require('express-promise-router')();
const createExpression = require('path-to-regexp');
const filterPublikController = require('../controllers/filterPublik.controller');

router.get('/filter-fktp-publik/:pro/:kab/:kec', filterPublikController.filterTitikFKTPPublik);
router.get('/filter-fkrtl-publik/:pro/:kab/:kec', filterPublikController.filterTitikFKRTLPublik);
 

router.get('/filter-fktp-list-publik/:pro/:kab/:kec', filterPublikController.filterFKTPPublik);
router.get('/filter-fkrtl-list-publik/:pro/:kab/:kec', filterPublikController.filterFKRTLPublik);


module.exports = router;