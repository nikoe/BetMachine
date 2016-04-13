/**
 * Created by Niko on 13.4.2016.
 */

var Transaction = require('../models/models.js').transaction;

var TransactionController = {

    add: function(req, res) {
        var data = req.body;

        if(data.userid) {
            Transaction.create(data)
                .then(function(result) {
                    res.json(result);
                })
                .catch(function(error) {

                });
        }

    }
};

module.exports = TransactionController;
