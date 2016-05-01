/**
 * Created by ekni on 01/05/16.
 */
app.controller('BetslipController', ['$scope',
    function ($scope) {

        $scope.bets = [];

        var bet1 = {
            name: 'HIFK - Jokerit',
            mark: '1',
            odd: '1.80'
        }

        var bet2 = {
            name: 'Barcelona - Real Madrid',
            mark: 'X',
            odd: '4.00'
        }

        $scope.bets.push(bet1);
        $scope.bets.push(bet2);



    }
]);