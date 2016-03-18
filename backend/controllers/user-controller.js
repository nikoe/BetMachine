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
    }
};

module.exports = UserController;