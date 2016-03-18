var express = require('express');
var router = express.Router();

var userController = require('../controllers/user-controller.js');

router.get('/users', userController.index);

module.exports = router;