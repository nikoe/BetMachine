/**
 * Created by Niko on 23.4.2016.
 */

app.controller('MatchDetailsController', ['$scope', 'MatchService', 'AlertFactory', 'AuthenticationFactory', '$window', '$stateParams', '$state',
    function($scope, MatchService, AlertFactory, AuthenticationFactory, $window, $stateParams, $state) {
        $scope.match = {};

        var matchid = $stateParams.matchid;

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

        MatchService.findById(matchid)
            .then(function(result) {
                var match = result;
                match.start_time = new Date(match.start_time);
                $scope.match = match;
            })
            .catch(function(error) {
                $state.go('matches.list');
            });


        $scope.update = function() {
            MatchService.updateById($scope.match.match_id, $scope.match)
                .then(function(result) {
                    var match = result.match;
                    match.start_time = new Date(match.start_time);
                    $scope.match = match;
                    AlertFactory.clearAll();
                    AlertFactory.add('success', result.msg, 'fa fa-check');
                })
        }
    }
]);
