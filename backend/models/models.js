var fs = require('fs');
var env = process.env.NODE_ENV || 'development';
var path = require('path');
var config = require(__dirname + '/../config/config.json')[env];
var basename  = path.basename(module.filename);

var models = {};

var conString = "postgres://"+config.username+":"+config.password+"@"+config.host+":"+config.port+"/"+config.database;

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== basename);
    })
    .forEach(function(file) {
        if (file.slice(-3) !== '.js') return;
        var model = require(path.join(__dirname, file))(conString);
        models[file.substring(0, file.length - 3)] = model;
    });

module.exports = models;



