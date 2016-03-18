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
                        reject({ success: false, data: err});
                    }

                    if(client == null) {
                        done();
                        reject({ success: false, data: err});
                    } else {
                        var query = client.query("SELECT id, username FROM account");

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

    return user;
};


