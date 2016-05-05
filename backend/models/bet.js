/**
 * Created by Niko on 18.4.2016.
 */

var Promise = require('bluebird');
var pg = require('pg');

module.exports = function(connectionString) {

    var bet = {

        create: function(bet) {
            return new Promise(function(resolve, reject) {
                var result = {};
                pg.connect(connectionString, function(err, client, done) {
                    if (err) {
                        reject(result);
                    }

                    if(client == null) {
                        done();
                        reject(result);
                    } else {

                        client.query("INSERT INTO bets (user_id, stake) values ($1, $2)", [bet.user_id, bet.stake]);

                        var query = client.query("INSERT INTO transactions (user_id, amount, transaction_type) values ($1, $2, $3)", [bet.user_id, (Math.abs(bet.stake) * -1.00).toFixed(2), 'BET']);

                        query.on('error', function (err) {
                            done();
                            reject();
                        });

                        query.on('row', function (row) {
                        });

                        query.on('end', function () {
                            done();
                            result.msg = 'Bet created!';
                            resolve(result);
                        });


                    }
                });

            });
        }

    };

    return bet;

};

