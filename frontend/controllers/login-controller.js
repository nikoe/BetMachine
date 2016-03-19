/**
 * Created by ekni on 19/03/16.
 */
app.controller('LoginController', ['$scope', '$window', '$location', 'UserAuthFactory', 'AuthenticationFactory',
    function ($scope, $window, $location, UserAuthFactory, AuthenticationFactory) {
        $scope.user = {
            username: '',
            password: ''
        };

        $scope.alerts = [];

        $scope.login = function () {
            $scope.alerts = [];
            var username = $scope.user.username,
                password = $scope.user.password;

            if ((username !== undefined && username.length > 0) && (password !== undefined && password.length > 0)) {
                UserAuthFactory.login(username, password).success(function (data) {

                    console.log(data);

                    AuthenticationFactory.isLogged = true;
                    AuthenticationFactory.user = data.user.username;
                    AuthenticationFactory.userRole = data.user.role;

                    $window.sessionStorage.token = data.token;
                    $window.sessionStorage.user = data.user.username;
                    $window.sessionStorage.userRole = data.user.role;

                    $location.path("/");

                }).error(function(status) {
                    $scope.alerts.push({type: 'danger', msg: 'Invalid credentials'});
                });
            } else {
                $scope.alerts.push({type: 'danger', msg: 'Please type username and password and try again!'});
            }
        }

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };
    }
]);
