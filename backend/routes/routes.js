var express = require('express');
var router = express.Router();

var userController = require('../controllers/user-controller.js');
var authController = require('../controllers/auth-controller.js');

router.get('/users', [require('../middlewares/validaterequest')], userController.index);
router.post('/auth', authController.auth);

module.exports = router;