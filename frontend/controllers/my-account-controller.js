/**
 * Created by Niko on 10.4.2016.
 */

app.controller('MyAccountController', ['$scope', 'AccountService', '$window',
    function($scope, AccountService, $window) {

        $scope.userdata = null;

        AccountService.getUserData($window.sessionStorage.userId)
            .then(function(result) {
               $scope.userdata = result;
            }, function(error) {
                console.log(error);
            });


    }]);