/**
 * Created by Niko on 13.4.2016.
 */

var Transaction = require('../models/models.js').transaction;
var TransactionValidator = require('../validators/transaction-validator.js');

var TransactionController = {

    create: function(req, res) {
        var data = req.body;

        if(data.userid) {

            TransactionValidator.validate(data)
                .then(function() {
                    Transaction.create(data)
                        .then(function(result) {
                            res.json(result);
                        })
                        .catch(function(error) {
                            res.status(500).json(error);
                        });
                })
                .catch(function(error) {
                    console.log(error);
                   res.status(500).json(error);
                });
        }

    },
    findByUserId: function(req, res) {
        Transaction.findByUserId(req.params.userid)
            .then(function(result) {
                res.json(result);
            })
            .catch(function(error) {

            });
    }
};

module.exports = TransactionController;
