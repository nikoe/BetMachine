/**
 * Created by ekni on 01/05/16.
 */
app.controller('BetslipController', ['$scope', 'BetslipFactory', '$rootScope',
    function ($scope, BetslipFactory, $rootScope) {
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
    }
]);