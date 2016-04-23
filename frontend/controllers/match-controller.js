/**
 * Created by Niko on 18.4.2016.
 */

app.controller('MatchController', ['$scope', 'MatchService', 'AlertFactory', 'AuthenticationFactory', '$window',
    function($scope, MatchService, AlertFactory, AuthenticationFactory, $window) {

        $scope.matches = [];

        $scope.dates = [];

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
            return (AuthenticationFactory.isLogged && $window.sessionStorage.userRole.toLowerCase() == 'admin');
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
        }

    }
]);