/**
 * Created by ekni on 25/03/16.
 */

app.controller('AccountController', ['$scope', 'AuthenticationFactory','UserAuthFactory', 'AccountService', '$window',
    function($scope, AuthenticationFactory, UserAuthFactory, AccountService, $window) {

        $scope.userId = $window.sessionStorage.userId;
        $scope.username = $window.sessionStorage.user;
        $scope.balance = 0.00;
        AccountService.getBalance($scope.userId)
            .then(function(balance) {
                $scope.balance = balance;
            }, function(error) {

            });

        $scope.isLogged = function() {
            return AuthenticationFactory.isLogged;
        };

        $scope.logout = function() {
            UserAuthFactory.logout();
        };

        $scope.$on('account:balance', function(event, data) {
           $scope.balance = data;
        });

}]);