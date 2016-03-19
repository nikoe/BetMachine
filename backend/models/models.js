var fs = require('fs');
var path = require('path');
var basename  = path.basename(module.filename);

var models = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== basename);
    })
    .forEach(function(file) {
        if (file.slice(-3) !== '.js') return;
        var model = require(path.join(__dirname, file))(process.env.DATABASE_URL);
        models[file.substring(0, file.length - 3)] = model;
    });

module.exports = models;



