var User = require('../models/models.js').user;

var UserController = {
    index: function(req, res) {
        User.findAll()
            .then(function(result) {
               res.json(result);
            })
            .catch(function(error) {
                res.status(500).json(error);
            });
    },
    balance: function(req, res) {
        if(req.params.userid) {
            User.balance(req.params.userid)
                .then(function(result) {
                   res.json(result);
                });
        }else {
            console.log('täällä');
            res.status(500).end();
        }
    },
    find: function(req, res) {
        if(req.params.userid) {
            User.findUserDataById(req.params.userid)
                .then(function(result) {
                    res.json(result);
                })
                .catch(function(error) {
                    res.status(500).json(error);
                });
        }else {
            res.status(500).end();
        }
    }
};

module.exports = UserController;