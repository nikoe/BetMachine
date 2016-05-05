/**
 * Created by ekni on 01/05/16.
 */
app.controller('BetslipController', ['$scope', 'BetslipFactory', '$rootScope', '$window', 'BetService', 'AlertFactory', 'AuthenticationFactory',
    function ($scope, BetslipFactory, $rootScope, $window, BetService, AlertFactory, AuthenticationFactory) {
        $scope.bets = BetslipFactory.getOdds();
        $scope.totalOdds = BetslipFactory.getTotalOdds();
        $scope.stake = 0.00;
        $scope.potentialWin = $scope.stake * $scope.totalOdds;

        $rootScope.$on('betslip:totalodds', function(event, totalOdds) {
           $scope.totalOdds = totalOdds;
           $scope.potentialWin = $scope.stake * $scope.totalOdds;
        });

        $scope.$watch('stake', function(newstake) {
            $scope.potentialWin = newstake * $scope.totalOdds;
        });

        $scope.deleteMatch = function(matchid) {
          BetslipFactory.deleteOdd(matchid);
        };

        $scope.createBet = function() {

            if(AuthenticationFactory.isLogged) {
                var data = {
                    user_id: $window.sessionStorage.userId,
                    stake: $scope.stake,
                    odds: $scope.bets
                };

                BetService.create(data)
                    .then(function(result) {
                        AlertFactory.clearAll();
                        AlertFactory.add('success', result.msg, 'fa fa-check');

                        BetslipFactory.deleteAll();
                        $scope.stake = 0.00;

                    }, function(error) {
                        AlertFactory.clearAll();
                        AlertFactory.add('danger', error.msg, 'fa fa-ban');
                    });
            }else {
                AlertFactory.clearAll();
                AlertFactory.add('danger', 'You must be logged in!', 'fa fa-ban');
            }
        };
    }
]);