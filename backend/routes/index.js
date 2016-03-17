var express = require('express');
var router = express.Router();

var userController = require('../controllers/user-controller.js');
/*
 * Routes that can be accessed by any one
 */
router.get('/users', userController.index);

module.exports = router;
