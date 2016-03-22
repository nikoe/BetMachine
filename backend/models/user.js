var Promise = require('bluebird');
var pg = require('pg');

module.exports = function(connectionString) {
    var user = {
        findAll: function() {
            return new Promise(function(reject, resolve) {
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
                        var query = client.query("SELECT user_id, username FROM users");

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
        findById: function(id) {
            return new Promise(function(resolve, reject) {
                var result = {};

                pg.connect(connectionString, function(err, client, done) {
                   if (err) {
                       reject(result);
                   }

                    if(client == null) {
                        done();
                        reject({ success: false, data: err});
                    } else {
                        var query = client.query("SELECT user_id, username, password FROM users WHERE user_id = $1", [id]);

                        query.on('error', function(err) {
                            done();
                            reject(result);
                        });

                        query.on('row', function(row) {
                            result = row;
                        });

                        query.on('end', function() {
                            done();
                            resolve(result);
                        });

                    }
                });
            });
        },
        findByUsername: function(username) {
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
                        var query = client.query("SELECT user_id, username, password FROM users WHERE username = $1", [username]);

                        query.on('error', function(err) {
                            done();
                            reject(result);
                        });

                        query.on('row', function(row) {
                            result = row;
                        });

                        query.on('end', function() {
                            done();
                            resolve(result);
                        });

                    }
                });
            });
        }
    };

    return user;
};


