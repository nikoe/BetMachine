/**
 * Created by Niko on 18.4.2016.
 */

app.controller('MatchController', ['$scope', 'MatchService',
    function($scope, MatchService) {

        $scope.matches = [];

        $scope.dates = [];

        MatchService.getAll()
            .then(function(results) {
                $scope.matches = results;
            });

        MatchService.findUpcomingMatchDates()
            .then(function(results) {
                results.forEach(function(date) {
                    var data = {
                        date: date.date,
                        matches: []
                    }

                    MatchService.findUpcomingMatchesByDate(date.date)
                        .then(function(matches) {
                            data.matches = matches;
                        })

                    $scope.dates.push(data);

                });
            });

    }
]);