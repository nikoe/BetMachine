var express = require('express');
var router = express.Router();

var userController = require('../controllers/user-controller.js');
var authController = require('../controllers/auth-controller.js');
var transactionController = require('../controllers/transaction-controller.js');
var matchController = require('../controllers/match-controller.js');
var oddController = require('../controllers/odd-controller.js');

router.get('/users', [require('../middlewares/validaterequest')], userController.index);
router.post('/users', userController.create);
router.get('/users/:userid', [require('../middlewares/validaterequest'), require('../middlewares/validateuseraction')], userController.find);
router.put('/users/:userid', [require('../middlewares/validaterequest'), require('../middlewares/validateuseraction')], userController.save);
router.get('/users/:userid/balance', [require('../middlewares/validaterequest'), require('../middlewares/validateuseraction')], userController.balance);


router.post('/transactions/:userid', [require('../middlewares/validaterequest'), require('../middlewares/validateuseraction')], transactionController.create);
router.get('/transactions/:userid', [require('../middlewares/validaterequest'), require('../middlewares/validateuseraction')], transactionController.findByUserId);

router.get('/matches', matchController.index);
router.get('/matches/dates', matchController.findUpcomingMatches);
router.get('/matches/dates/:date', matchController.findUpcomingMatchesByDate);
router.delete('/matches/:matchid', matchController.deleteById);
router.get('/matches/:matchid', matchController.findById);
router.put('/matches/:matchid', [require('../middlewares/validaterequest')], matchController.save);
router.get('/matches/:matchid/odds', oddController.findByMatchId);

router.post('/matches', [require('../middlewares/validaterequest')], matchController.create);


router.post('/auth', authController.auth);

module.exports = router;