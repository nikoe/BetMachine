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
                        var query = client.query("select name, start_time from matches where start_time >= $1 and start_time <= date(date($1) + '1 day'::interval) order by start_time", [date]);

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
        }

    };

    return match;

};