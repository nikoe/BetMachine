/**
 * Created by Niko on 16.4.2016.
 */

var Transaction = require('../models/models.js').transaction;
var Promise = require('bluebird');
var BigNumber = require('bignumber.js');

var TransactionValidator = {
    validate: function(data) {
        var _that = this;
        return new Promise(function(resolve, reject) {

            var result = {};

            if(!data.type) {
                result.msg = 'Transaction type missing!';
                reject(result);
                return;
            }

            if(!data.amount) {
                result.msg = 'Amount missing!';
                reject(result);
                return;
            }

            if(!data.userid) {
                result.msg = 'Userid missing!';
                reject(result);
                return;
            }

            if(Math.abs(data.amount)  > 1000000) {
                result.msg = 'Too high amount!';
                reject(result);
                return;
            }

            if(data.type == 'DEPOSIT') {
                _that.validateDeposit(data, function(error, result) {
                   if(error) {
                       reject(result);
                   }else {
                       resolve();
                   }
                });
            }else if(data.type == 'WITHDRAW') {
                _that.validateWithdraw(data, function(error, result) {
                    if(error) {
                        reject(result);
                    }else {
                        resolve();
                    }
                });
            }
        });
    },
    validateDeposit: function(data, callback) {
        var result = {};
        if(data.amount <= 0) {
            result.msg = 'You can only deposit positive amounts!';
            callback(true, result);
            return;
        }

        callback(false, null);
    },
    validateWithdraw: function(data, callback) {
        var _result = {};

        Transaction.findBalanceByUserId(data.userid, function(error, result) {
           if(error) {
               _result.msg = 'Error fetching account balance, try again!';
               callback(true, result);
               return;
           }

            var amount = new BigNumber(data.amount);
            var balance = new BigNumber(result);

            if(amount.greaterThan(balance)) {
                _result.msg = 'Cannot exceed account balance!';
                callback(true, _result);
                return;
            }

            callback(false, null);

        });

    }
};

module.exports = TransactionValidator;