var express  = require('express');
var app      = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// configuration =================
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/frontend'));                 // set the static files location /public/img will be /img for users
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

app.all('/*', function(req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

// backend ============================
app.use('/api', require('./backend/routes/routes'));

// frontend ============================
app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/frontend/index.html');
});


app.use(function(req, res, next) {
    res.status(404).end();
});

// listen (start app with node server.js) ======================================
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});