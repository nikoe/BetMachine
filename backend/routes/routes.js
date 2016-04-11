var express = require('express');
var router = express.Router();

var userController = require('../controllers/user-controller.js');
var authController = require('../controllers/auth-controller.js');

router.get('/users', [require('../middlewares/validaterequest')], userController.index);
router.post('/users', userController.create);
router.get('/users/:userid', [require('../middlewares/validaterequest'), require('../middlewares/validateuseraction')], userController.find);
router.put('/users/:userid', [require('../middlewares/validaterequest'), require('../middlewares/validateuseraction')], userController.save);
router.get('/users/:userid/balance', [require('../middlewares/validaterequest'), require('../middlewares/validateuseraction')], userController.balance);
router.post('/auth', authController.auth);

module.exports = router;