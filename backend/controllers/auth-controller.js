
var User = require('../models/models.js').user;
var jwt = require('jwt-simple');
var Promise = require('bluebird');
var PasswordCrypt = require('../helpers/password-crypt.js');

var AuthController = {
    auth: function(req, res) {
        var username = req.body.username || '';
        var password = req.body.password || '';

        if (username == '' || password == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }

        AuthController.validate(username, password)
            .then(function(data) {
                res.status(200);
                res.json({
                    "status": 200,
                    "data" : data
                });
            })
            .catch(function(error) {
                res.status(401);
                res.json({
                    "status": 401,
                    "message": error.data
                });
            });

    },
    validate: function (username, password) {
        return new Promise(function(resolve, reject) {
            User.findByUsername(username)
                .then(function(result) {
                    if(result.user_id) {
                        PasswordCrypt.comparePassword(password, result.password, function(err, isMatch) {
                            if(err) {
                                reject({data : 'Invalid Credentials'});
                            }
                           if(isMatch) {
                                var data = {};
                                data.username = result.username;
                                data.user_id = result.user_id;
                                data.role = "admin";
                                resolve(genToken(data));
                           } else {
                               reject({data : 'Invalid Credentials'});
                           }
                        });
                    }else {
                        reject({data : 'Invalid credentials'});
                    }
                })
                .catch(function(error) {
                    reject({data : 'Invalid credentials'});
                });
        });
    },
    validateUser: function(userid) {
        return new Promise(function(resolve, reject) {
           User.findById(userid)
               .then(function(result) {
                    if(result.user_id) {
                        resolve(result);
                    }
               })
               .catch(function(error) {
                  reject({data : 'Invalid user'})
               });
        });
    }
};

// private methods
function genToken(user) {
    var expires = expiresIn(7); // 7 days
    var token = jwt.encode({
        iss: user.user_id,
        exp: expires
    }, process.env.TOKEN_SECRET);

    return {
        token: token,
        expires: expires,
        user: user
    };
}

function expiresIn(numDays) {
    var date = new Date();
    return date.setDate(date.getDate() + numDays);
}

module.exports = AuthController;
