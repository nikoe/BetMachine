var express = require('express');
var router = express.Router();

var userController = require('../controllers/user-controller.js');
var authController = require('../controllers/auth-controller.js');

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "localhost");
    next();
});

router.get('/users', userController.index);
router.post('/auth', authController.auth);

module.exports = router;