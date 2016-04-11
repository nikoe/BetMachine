/**
 * Created by Niko on 10.4.2016.
 */

app.controller('MyAccountController', ['$scope', 'AccountService', '$window', 'AlertFactory',
    function($scope, AccountService, $window, AlertFactory) {

        $scope.userdata = null;
        $scope.username = $window.sessionStorage.user;

        AccountService.getUserData($window.sessionStorage.userId)
            .then(function(result) {
               $scope.userdata = result;
            }, function(error) {
                console.log(error);
            });


        $scope.update = function() {
            if($scope.userdata != null) {
                console.log('tääl');
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

    }]);