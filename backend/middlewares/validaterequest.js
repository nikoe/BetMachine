/**
 * Created by ekni on 23/03/16.
 */
var jwt = require('jwt-simple');
var validateUser = require('../controllers/auth-controller').validateUser;

module.exports = function(req, res, next) {

    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];

    if (token || key) {
        try {
            var decoded = jwt.decode(token, process.env.TOKEN_SECRET);

            if (decoded.exp <= Date.now()) {
                res.status(400);
                res.json({
                    "status": 400,
                    "message": "Token Expired"
                });
                return;
            }

            if(decoded.iss != key) {
                res.status(401);
                res.json({
                    "status": 401,
                    "message": "Invalid Token or Key"
                });
                return;
            }

            validateUser(key)
                .then(function(dbUser) {
                    if (dbUser) {
                        next();

                    } else {
                        res.status(401);
                        res.json({
                            "status": 401,
                            "message": "Invalid User"
                        });
                        return;
                    }
                })
                .catch(function(error) {
                    res.status(401);
                    res.json({
                        "status": 401,
                        "message": "Invalid User"
                    });
                    return
                });

        } catch (err) {
            res.status(500);
            res.json({
                "status": 500,
                "message": "Oops something went wrong",
                "error": err
            });
        }
    } else {
        res.status(401);
        res.json({
            "status": 401,
            "message": "Invalid Token or Key"
        });
        return;
    }
};
