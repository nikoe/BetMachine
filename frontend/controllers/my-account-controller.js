/**
 * Created by Niko on 10.4.2016.
 */

app.controller('MyAccountController', ['$scope', 'AccountService', '$window', 'AlertFactory', 'TransactionService',
    function($scope, AccountService, $window, AlertFactory, TransactionService) {

        $scope.userdata = null;
        $scope.username = $window.sessionStorage.user;
        $scope.balance = 0.00;
        $scope.balanceInput = '';
        $scope.transactions = null;

        $scope.totalItems = 0;
        $scope.currentPage = 1;
        $scope.numPerPage = 10;

        $scope.paginate = function(value) {
            var begin, end, index;
            begin = ($scope.currentPage - 1) * $scope.numPerPage;
            end = begin + $scope.numPerPage;
            index = $scope.transactions.indexOf(value);
            return (begin <= index && index < end);
        };

        AccountService.getUserData($window.sessionStorage.userId)
            .then(function(result) {
               $scope.userdata = result;
            }, function(error) {
                console.log(error);
            });


        TransactionService.getBalance($window.sessionStorage.userId)
            .then(function(result) {
                $scope.balance = result;
            }, function(error) {
                console.log(error);
            });

        TransactionService.getTransactions($window.sessionStorage.userId)
            .then(function(result) {
               $scope.transactions = result;
                $scope.totalItems = result.length;
            }, function(error) {
                console.log(error);
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
            AlertFactory.clearAll();
            var amount = parseFloat($scope.balanceInput.replace(',', '.')).toFixed(2);

            if(!isNaN(amount)) {

                if(amount > 0) {

                    var data = {
                        userid: $window.sessionStorage.userId,
                        type: 'DEPOSIT',
                        amount: amount
                    };

                    TransactionService.deposit($window.sessionStorage.userId, data)
                        .then(function (result) {
                            $scope.balance = result;

                            TransactionService.getTransactions($window.sessionStorage.userId)
                                .then(function (result) {
                                    $scope.transactions = result;
                                    $scope.totalItems = result.length;
                                }, function (error) {
                                });

                        }, function (error) {
                            AlertFactory.add('danger', error.msg, 'fa fa-ban');
                        });
                }else {
                    AlertFactory.add('danger', 'You can only deposit positive amounts!', 'fa fa-ban');
                }
            }else {
                AlertFactory.add('danger', 'Amount must be numeric!', 'fa fa-ban');
            }

            $scope.balanceInput = '';
        };

        $scope.withdraw = function() {
            AlertFactory.clearAll();

            var amount = parseFloat($scope.balanceInput.replace(',', '.')).toFixed(2);

            if(!isNaN(amount)) {

                if(amount > 0) {

                    var data = {
                        userid: $window.sessionStorage.userId,
                        type: 'WITHDRAW',
                        amount: amount
                    };

                    TransactionService.deposit($window.sessionStorage.userId, data)
                        .then(function (result) {
                            $scope.balance = result;

                            TransactionService.getTransactions($window.sessionStorage.userId)
                                .then(function (result) {
                                    $scope.transactions = result;
                                    $scope.totalItems = result.length;
                                }, function (error) {
                                });

                        }, function (error) {
                            AlertFactory.add('danger', error.msg, 'fa fa-ban');
                        });
                }else {
                    AlertFactory.add('danger', 'You can only withdraw positive amounts!', 'fa fa-ban');
                }
            }else {
                AlertFactory.add('danger', 'Amount must be numeric!', 'fa fa-ban');
            }

            $scope.balanceInput = '';
        };

    }]);