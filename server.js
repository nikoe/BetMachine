var express  = require('express');
var app      = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// configuration =================
app.use(express.static(__dirname + '/frontend'));                 // set the static files location /public/img will be /img for users
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

app.get('*', function(req, res) {
    res.sendFile('./frontend/index.html');
});

// listen (start app with node server.js) ======================================
app.listen(80);
console.log("Server started on port 80");