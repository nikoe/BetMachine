/**
 * Created by ekni on 25/03/16.
 */

app.controller('NavAccountController', ['$scope', 'AuthenticationFactory','UserAuthFactory', 'AccountService', '$window',
    function($scope, AuthenticationFactory, UserAuthFactory, AccountService, $window) {

        $scope.userId = $window.sessionStorage.userId;
        $scope.username = $window.sessionStorage.user;
        $scope.balance = 0.00;

        if(AuthenticationFactory.isLogged) {
            AccountService.getBalance($window.sessionStorage.userId)
                .then(function (balance) {
                    $scope.balance = balance;
                }, function (error) {

                });
        }

        $scope.isLogged = function() {
            return AuthenticationFactory.isLogged;
        };

        $scope.logout = function() {
            UserAuthFactory.logout();
            $scope.userId = '';
            $scope.username = '';
            $scope.balance = 0.00;
        };

        $scope.$on('account:balance', function(event, data) {
           $scope.balance = data;
        });

        $scope.$on('loggedIn', function(event, data) {
            $scope.userId = $window.sessionStorage.userId;
            $scope.username = $window.sessionStorage.user;
            AccountService.getBalance($scope.userId)
                .then(function(balance) {
                    $scope.balance = balance;
                }, function(error) {

                });
        });

}]);