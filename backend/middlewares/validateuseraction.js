var jwt = require('jwt-simple');
module.exports = function(req, res, next) {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    var userid = req.params.userid;

    var decoded = jwt.decode(token, process.env.TOKEN_SECRET);

    if(decoded.iss != userid) {
        res.status(403);
        res.json({
            "status": 403,
            "message": "Forbidden"
        });
        return;
    } else {
        next();
        return;
    }
}