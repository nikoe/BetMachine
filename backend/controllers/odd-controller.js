/**
 * Created by Niko on 2.5.2016.
 */

var Odd = require('../models/models.js').odd;

var OddController = {
    findByMatchId: function(req, res) {
        var matchid = req.params.matchid;

        Odd.findByMatchId(matchid)
            .then(function(result) {
                res.json(result);
            });
    }
};

module.exports = OddController;

