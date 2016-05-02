/**
 * Created by Niko on 18.4.2016.
 */

var Promise = require('bluebird');
var pg = require('pg');

module.exports = function(connectionString) {

    var odd = {
        findByMatchId: function(matchid) {
            return new Promise(function (resolve, reject) {
                var results = [];

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
                        var query = client.query("select odd_id, name, probability, factor, match_id from odds where match_id = $1", [matchid]);

                        //if error reject
                        query.on('error', function (err) {
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

    return odd;

};
