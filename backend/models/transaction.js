/**
 * Created by Niko on 13.4.2016.
 */

var Promise = require('bluebird');
var pg = require('pg');

module.exports = function(connectionString) {
    var transaction = {

        create: function(data) {

            var that = this;

            return new Promise(function(resolve, reject) {
                var result = {};


                if(data.type == 'WITHDRAW') {
                    data.amount = (Math.abs(data.amount) * -1.00).toFixed(2);
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
        },

        findByUserId: function(userid) {
            return new Promise(function(resolve, reject) {
                var results = [];
                pg.connect(connectionString, function(err, client, done) {
                    // Handle connection errors
                    if(err) {
                        done();
                        reject(results);
                    }

                    if(client == null) {
                        done();
                        reject(results);
                    } else {
                        var query = client.query("SELECT transaction_time, amount, transaction_type FROM transactions where user_id = $1 order by transaction_time desc", [userid]);

                        //if error reject
                        query.on('error', function(err) {
                            done();
                            reject(results);
                        });

                        // Stream results back one row at a time
                        query.on('row', function (row) {
                            results.push(row);
                        });

                        // After all data is returned, close connection and return results
                        query.on('end', function () {
                            done();
                            resolve(results);
                        });
                    }
                });
            });
        },
        findBalanceByUserId: function(userid, callback) {
            var client = new pg.Client(connectionString);
            client.connect();

            client.query("select coalesce(sum(amount), 0.00) as balance from transactions where user_id = $1", [userid], function(error, result) {
                if(error) {
                    callback(error, null);
                }else {
                    callback(null, result.rows[0].balance);
                }
            });
        }

    };

    return transaction;
};
