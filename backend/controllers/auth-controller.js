/**
 * Created by Niko on 19.3.2016.
 */

var AuthController = {
    auth: function(req, res) {
        var user = {
            "username": "test",
            "role": "admin"
        };
        res.json({"user":user});
    }
};

module.exports = AuthController;
