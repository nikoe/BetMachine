app.controller('SignupController', ['$scope', 'AccountService', '$state', 'AlertFactory',
    function($scope, AccountService, $state, AlertFactory) {

        $scope.data = {
            username: '',
            password: ''
        };

        $scope.signup = function() {
            AccountService.createUserData($scope.data)
                .then(function(result) {

                    AlertFactory.clearAll();
                    AlertFactory.add('success', result.message, 'fa fa-check');

                    $state.go('index');

                }, function(error) {
                    AlertFactory.clearAll();
                    AlertFactory.add('danger', error.message, 'fa fa-ban');
                });
        }
    }
]);