/**
 * Created by Niko on 10.4.2016.
 */

app.controller('MyAccountController', ['$scope', 'AccountService', '$window', 'AlertFactory',
    function($scope, AccountService, $window, AlertFactory) {

        $scope.userdata = null;
        $scope.username = $window.sessionStorage.user;
        $scope.balance = 0.00;
        $scope.balanceInput = '';

        AccountService.getUserData($window.sessionStorage.userId)
            .then(function(result) {
               $scope.userdata = result;
            }, function(error) {
                console.log(error);
            });


        AccountService.getBalance($window.sessionStorage.userId)
            .then(function(result) {
                $scope.balance = result;
            }, function(error) {

            });

        $scope.update = function() {
            if($scope.userdata != null) {
                AccountService.updateUserData($window.sessionStorage.userId, $scope.userdata)
                    .then(function(result) {
                        AlertFactory.clearAll();
                        AlertFactory.add('success', result.msg, 'fa fa-check');
                        $scope.userdata = result.user;
                    }, function(error) {
                        AlertFactory.clearAll();
                        AlertFactory.add('danger', error.message, 'fa fa-ban');
                    });
            }
        };


        $scope.deposit = function() {
            var amount = parseFloat($scope.balanceInput.replace(',', '.')).toFixed(2);

            if(!isNaN(amount)) {
                var data = {
                    userid: $window.sessionStorage.userId,
                    type: 'DEPOSIT',
                    amount: amount
                };

                AccountService.deposit($window.sessionStorage.userId, data)
                    .then(function(result) {
                        $scope.balance = result;
                    }, function(error) {

                    });
            }else {
                console.log("Not numeric");
            }

            $scope.balanceInput = '';
        };

    }]);