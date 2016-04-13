/**
 * Created by Niko on 13.4.2016.
 */

var Promise = require('bluebird');
var pg = require('pg');

module.exports = function(connectionString) {
    var transaction = {

        create: function(data) {
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

                pg.connect(connectionString, function(err, client, done) {
                    if (err) {
                        reject(result);
                        return;
                    }

                    if(client == null) {
                        done();
                        reject(result);
                        return;
                    } else {

                        client.query("insert into transactions (user_id, amount, transaction_type) values ($1, $2, $3)", [data.userid, data.amount, data.type]);

                        var query = client.query("select coalesce(sum(amount), 0.00) as balance from transactions where user_id = $1", [data.userid]);

                        query.on('error', function(err) {
                            done();
                            reject(result);
                            return;
                        });

                        query.on('row', function(row) {
                            result = row;
                        });

                        query.on('end', function() {
                            done();
                            resolve(result);
                            return;
                        });

                    }
                });
            });
        }

    };

    return transaction;
};
