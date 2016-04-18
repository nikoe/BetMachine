/**
 * Created by Niko on 18.4.2016.
 */

var Match = require('../models/models.js').match;

var MatchController = {

    index: function(req, res) {
        Match.findAll()
            .then(function(results) {
                res.json(results);
            })
            .catch(function(error) {
                res.status(500).json(error);
            })
    },
    findUpcomingMatches: function(req, res) {
        Match.findUpcomingMatchDates()
            .then(function(results) {
               res.json(results);
            });
    },
    findUpcomingMatchesByDate: function(req, res) {
        var date = req.params.date;

        Match.findUpcomingMatchesByDate(date)
            .then(function(results) {
                res.json(results);
            })
    }

};

module.exports = MatchController;
