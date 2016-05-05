/**
 * Created by Niko on 5.5.2016.
 */

var Transaction = require('../models/models.js').transaction;
var Match = require('../models/models.js').match;
var Promise = require('bluebird');
var BigNumber = require('bignumber.js');

var BetValidator = {
    validate: function(bet) {
        return new Promise(function(resolve, reject) {
            var user_id = bet.user_id;
            var stake = bet.stake;
            var result = {};

            Transaction.findBalanceByUserId(user_id, function(error, balance) {
                if(error) {
                    result.msg = 'Error fetching account balance, try again!';
                    reject(result);
                    return;
                }

                var s = new BigNumber(stake);
                var b = new BigNumber(balance);

                if(s.greaterThan(b)) {
                    result.msg = 'Cannot exceed account balance!';
                    reject(result);
                    return;
                }

                resolve();
            });

        });
    }
};

module.exports = BetValidator;