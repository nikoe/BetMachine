/**
 * Created by Niko on 18.4.2016.
 */

app.controller('MatchController', ['$scope', 'MatchService', 'AlertFactory',
    function($scope, MatchService, AlertFactory) {

        $scope.matches = [];

        $scope.dates = [];

        MatchService.getAll()
            .then(function(results) {
                $scope.matches = results;
            });


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
        }

        loadUpcomingMatchDates();


        $scope.delete = function(matchid) {
            AlertFactory.clearAll();

            MatchService.deleteById(matchid)
                .then(function(result) {
                    AlertFactory.add('success', result.msg, 'fa fa-check');
                    loadUpcomingMatchDates();
                });
        }

    }
]);