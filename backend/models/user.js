var Promise = require('bluebird');
var pg = require('pg');

module.exports = function(connectionString) {
    var user = {
        findAll: function() {
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
        findAuthDataByUserId: function(id) {
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
        findAuthDataByUsername: function(username) {
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
                        var query = client.query("SELECT user_id, username, password, role FROM users WHERE username = $1", [username]);

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
        balance: function(userid) {
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
                        var query = client.query("select coalesce(sum(amount), 0.00) as balance from transactions where user_id = $1", [userid]);

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
        findUserDataById: function(userid) {
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
                        var query = client.query("select firstname, surname, address, postalcode, city, country from users where user_id = $1", [userid]);

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
        updateUserDataById: function(userid, data) {
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
                        client.query("update users set firstname = ($2), surname = ($3), address = ($4), postalcode = ($5), city = ($6), country = ($7) where user_id = ($1)", [userid, data.firstname, data.surname, data.address, data.postalcode, data.city, data.country]);

                        var query = client.query("select firstname, surname, address, postalcode, city, country from users where user_id = $1", [userid]);

                        query.on('error', function(err) {
                            done();
                            reject(result);
                        });

                        query.on('row', function(row) {
                            result.user = row;
                        });

                        query.on('end', function() {
                            done();
                            result.msg = 'Account information updated!';
                            resolve(result);
                        });

                    }
                });
            });
        },
        createUserData: function(data) {
            var that = this;
            return new Promise(function(resolve, reject) {
                var result = {};
                that.isUsernameFree(data.username, function(isfree) {
                    if(isfree) {
                        pg.connect(connectionString, function (err, client, done) {
                            if (err) {
                                reject();
                            }

                            if (client == null) {
                                done();
                                reject();
                            } else {

                                var query = client.query("insert into users (username, password) values ($1, $2)", [data.username, data.password]);

                                query.on('error', function (err) {
                                    done();
                                    reject();
                                });

                                query.on('row', function (row) {
                                });

                                query.on('end', function () {
                                    done();
                                    result.msg = 'Account created!';
                                    resolve(result);
                                });
                            }
                        });
                    } else {
                        result.msg = 'Username is already in use!';
                        reject(result);
                    }
                });
            });
        },
        isUsernameFree: function(username, callback) {
                var client = new pg.Client(connectionString);
                client.connect();

                client.query('SELECT count(user_id) as count from users where username = $1', [username.toLowerCase()], function(error, result) {
                    if(result.rows[0].count == 0) {
                        callback(true);
                    }else {
                        callback(false);
                    }
                });
        }

    };
    return user;
};


