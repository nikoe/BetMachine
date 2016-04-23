/**
 * Created by Niko on 18.4.2016.
 */

app.controller('MatchController', ['$scope', 'MatchService', 'AlertFactory', 'AuthenticationFactory', '$window', '$state',
    function($scope, MatchService, AlertFactory, AuthenticationFactory, $window, $state) {

        $scope.matches = [];

        $scope.dates = [];

        $scope.newmatch = {
            name: '',
            description: '',
            start_time: ''
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
                        start_time: ''
                    };
                    AlertFactory.add('success', result.msg, 'fa fa-check');

                }, function(error) {
                    AlertFactory.clearAll();
                    AlertFactory.add('danger', error.msg, 'fa fa-ban');
                });
        };

        $scope.update = function(matchid) {
            $state.go('matches.details', {matchid: matchid});
        };

    }
]);