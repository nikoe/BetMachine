/**
 * Created by Niko on 18.4.2016.
 */

app.controller('MatchController', ['$scope', 'MatchService', 'AlertFactory', 'AuthenticationFactory', '$window', '$state', 'BetslipFactory',
    function($scope, MatchService, AlertFactory, AuthenticationFactory, $window, $state, BetslipFactory) {

        $scope.matches = [];

        $scope.dates = [];

        BetslipFactory.getTotalOdds();

        $scope.newmatch = {
            name: '',
            description: '',
            start_time: '',
            probabilities: [{
                mark: '1',
                probability: 0
            },{
                mark: 'X',
                probability: 0
            },{
                mark: '2',
                probability: 0
            }]
        };

        $scope.startTimePicker = {
            opened: false,
            open: function() {
                this.opened = true;
            },
            options: {
                showMeridian: false,
                minuteStep: 5
            }
        };

        var loadUpcomingMatchDates = function() {
            $scope.dates = [];
            MatchService.findUpcomingMatchDates()
                .then(function (results) {
                    results.forEach(function (date) {
                        var data = {
                            date: date.date,
                            matches: []
                        }

                        MatchService.findUpcomingMatchesByDate(date.date)
                            .then(function (matches) {
                                matches.forEach(function(match) {
                                   match.odds = [];
                                   MatchService.findOddsByMatchId(match.match_id)
                                       .then(function(result) {
                                           match.odds = result;
                                       });
                                });

                                data.matches = matches;
                            })

                        $scope.dates.push(data);

                    });
                });
        };

        loadUpcomingMatchDates();

        $scope.isAdmin = function() {
            return (AuthenticationFactory.isAdmin);
        }


        $scope.delete = function(matchid) {
            AlertFactory.clearAll();

            MatchService.deleteById(matchid)
                .then(function(result) {
                    AlertFactory.add('success', result.msg, 'fa fa-check');
                    loadUpcomingMatchDates();
                }, function(error) {
                    AlertFactory.clearAll();
                    AlertFactory.add('danger', error.msg, 'fa fa-ban');
                });
        };

        $scope.create = function() {
            MatchService.create($scope.newmatch)
                .then(function(result) {
                    $scope.newmatch = {
                        name: '',
                        description: '',
                        start_time: '',
                        probabilities: [{
                            mark: '1',
                            probability: '0'
                        },{
                            mark: 'X',
                            probability: '0'
                        },{
                            mark: '2',
                            probability: '0'
                        }]
                    };

                    AlertFactory.add('success', result.msg, 'fa fa-check');

                }, function(error) {
                    AlertFactory.clearAll();
                    AlertFactory.add('danger', error.msg, 'fa fa-ban');
                });
        };

        $scope.addMatchToBetSlip = function(matchname, odd) {
            odd.match_name = matchname;
            BetslipFactory.addOdd(odd);
        };

        $scope.update = function(matchid) {
            $state.go('matches.details', {matchid: matchid});
        };
    }
]);