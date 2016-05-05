/**
 * Created by Niko on 5.5.2016.
 */
var Bet = require('../models/models.js').bet;
var BetValidator = require('../validators/bet-validator.js');

var BetController = {
    create: function(req, res) {
        var bet = req.body;

        BetValidator.validate(bet)
            .then(function() {
                Bet.create(bet)
                    .then(function(result) {
                        res.json(result);
                    })
                    .catch(function(error) {
                       res.status(500).json(error);
                    });
            })
            .catch(function(error) {
               res.status(500).json(error);
            });

    }
};

module.exports = BetController;
