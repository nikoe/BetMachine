/**
 * Created by Niko on 18.4.2016.
 */

var Promise = require('bluebird');
var pg = require('pg');

module.exports = function(connectionString) {

    var match = {
        findAll: function() {
            return new Promise(function(resolve, reject) {
                var results = [];

                pg.connect(connectionString, function(err, client, done) {
                    // Handle connection errors
                    if(err) {
                        done();
                        reject();
                    }

                    if(client == null) {
                        done();
                        reject();
                    } else {
                        var query = client.query("SELECT match_id, start_time, end_time, close_time, name, description, status FROM matches");

                        //if error reject
                        query.on('error', function(err) {
                            done();
                            reject();
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
        findUpcomingMatchDates: function(callback) {
            return new Promise(function(resolve, reject) {
                var results = [];

                pg.connect(connectionString, function(err, client, done) {
                    // Handle connection errors
                    if(err) {
                        done();
                        reject();
                    }

                    if(client == null) {
                        done();
                        reject();
                    } else {
                        var query = client.query("select date(start_time) as date from matches where date(start_time) >= date(now()) group by date(start_time) order by date(start_time)");

                        //if error reject
                        query.on('error', function(err) {
                            done();
                            reject();
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
        findUpcomingMatchesByDate: function(date) {
            return new Promise(function(resolve, reject) {
                var results = [];

                pg.connect(connectionString, function(err, client, done) {
                    // Handle connection errors
                    if(err) {
                        done();
                        reject();
                    }

                    if(client == null) {
                        done();
                        reject();
                    } else {
                        var query = client.query("select name, start_time, match_id from matches where start_time >= $1 and start_time <= date(date($1) + '1 day'::interval) order by start_time", [date]);

                        //if error reject
                        query.on('error', function(err) {
                            done();
                            reject();
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
        deleteById: function(matchid) {
            return new Promise(function(resolve, reject) {
                var result = {};

                pg.connect(connectionString, function(err, client, done) {
                    // Handle connection errors
                    if(err) {
                        done();
                        reject();
                    }

                    if(client == null) {
                        done();
                        reject();
                    } else {
                        var query = client.query("delete from matches where match_id = $1", [matchid]);

                        //if error reject
                        query.on('error', function(err) {
                            done();
                            reject();
                        });

                        // After all data is returned, close connection and return results
                        query.on('end', function () {
                            done();
                            result.msg = 'Match deleted succesfully!';
                            resolve(result);
                        });
                    }
                });

            });
        },
        create: function(data) {
            return new Promise(function(resolve, reject) {
                var result = {};

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

                        client.query("insert into matches (creator_id, name, description, start_time, status, close_time ) values ($1, $2, $3, $4, $5, $6) RETURNING match_id", [data.creator_id, data.name, data.description, data.start_time, 'NOT_STARTED', data.close_time], function(err, result) {

                            if(err) {
                                done();
                                reject();
                                return;
                            }

                            var matchid = result.rows[0].match_id;

                            var probabilities = data.probabilities;

                            probabilities.forEach(function(probability) {
                                if(probability.probability == null) {
                                    probability.probability = 0;
                                }
                                if(probability.probability == 0) {
                                    factor = 1.00;
                                }else {
                                    var factor = (1.00/probability.probability) * 100.00;
                                }
                                client.query("insert into odds (name, match_id, probability, factor) values($1, $2, $3, round($4, 2))", [probability.mark, matchid, probability.probability, factor]);
                            });

                            result.msg = "Match created successfully!";
                            resolve(result);
                            return;

                        });
                        /*
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
                            result.msg = "Match created successfully!";
                            resolve(result);
                            return;
                        });
                        */
                    }
                });
            });
        },
        findById: function(id) {
            return new Promise(function (resolve, reject) {
                var result = {};

                pg.connect(connectionString, function (err, client, done) {
                    // Handle connection errors
                    if (err) {
                        done();
                        reject();
                    }

                    if (client == null) {
                        done();
                        reject();
                    } else {
                        var query = client.query("select name, start_time, match_id, description from matches where match_id = $1", [id]);

                        //if error reject
                        query.on('error', function (err) {
                            done();
                            reject();
                        });

                        // Stream results back one row at a time
                        query.on('row', function (row) {
                            result = row;
                        });

                        // After all data is returned, close connection and return results
                        query.on('end', function () {
                            done();
                            resolve(result);
                        });
                    }
                });

            });
        },
        updateMatchDataById: function(matchid, data) {
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
                        client.query("update matches set name = ($2), description = ($3), start_time = ($4), close_time = ($5) where match_id = ($1)", [matchid, data.name, data.description, data.start_time, data.close_time]);

                        var query = client.query("select name, start_time, match_id, description from matches where match_id = $1", [matchid]);

                        query.on('error', function(err) {
                            done();
                            reject(result);
                        });

                        query.on('row', function(row) {
                            result.match = row;
                        });

                        query.on('end', function() {
                            done();
                            result.msg = 'Match details updated!';
                            resolve(result);
                        });

                    }
                });
            });
        }
    };

    return match;

};