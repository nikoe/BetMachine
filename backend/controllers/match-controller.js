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
    },
    deleteById: function(req, res) {
        var matchid = req.params.matchid;
        if(matchid) {
            Match.deleteById(matchid)
                .then(function(result) {
                    res.json(result);
                })
        }
    },
    create: function(req, res) {
        var data = req.body;
        Match.create(data)
            .then(function(result) {
                res.json(result);
            })
            .catch(function(error) {
                res.status(500).json(error);
            });
    },
    findById: function(req, res) {
        var matchid = req.params.matchid;
        if(matchid) {
            Match.findById(matchid)
                .then(function(result) {
                    res.json(result);
                })
                .catch(function(error) {
                    res.status(404).json(error);
                });
        }
    },
    save: function(req, res) {
        var matchid = req.params.matchid;
        if(matchid) {
            Match.updateMatchDataById(req.params.matchid, req.body)
                .then(function(result) {
                    res.json(result);
                });
        }
    }

};

module.exports = MatchController;
