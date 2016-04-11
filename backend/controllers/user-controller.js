var User = require('../models/models.js').user;
var PasswordCrypt = require('../helpers/password-crypt.js');

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
    },
    save: function(req, res) {
        //TODO datavalidation
        User.updateUserDataById(req.params.userid, req.body)
            .then(function(result) {
                res.json(result);
            })
            .catch(function(error) {
               res.status(500).json(error);
            });
    },
    create: function(req, res) {
        if(req.body.username && req.body.password) {
            var password = PasswordCrypt.cryptPassword(req.body.password, function(error, result) {
                var data = {
                    username: req.body.username,
                    password: result
                };

                User.createUserData(data)
                    .then(function(result) {
                        res.json(result);
                    });
            });
        }else {
            res.status(400).json({msg: 'Username and password required!'});
        }
    }
};

module.exports = UserController;