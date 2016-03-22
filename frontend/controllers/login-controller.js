/**
 * Created by ekni on 19/03/16.
 */
app.controller('LoginController', ['$scope', '$window', '$location', 'UserAuthFactory', 'AuthenticationFactory', 'AlertFactory',
    function ($scope, $window, $location, UserAuthFactory, AuthenticationFactory, AlertFactory) {
        $scope.user = {
            username: '',
            password: ''
        };

        $scope.login = function () {
            $scope.alerts = [];
            var username = $scope.user.username,
                password = $scope.user.password;

            if ((username !== undefined && username.length > 0) && (password !== undefined && password.length > 0)) {
                UserAuthFactory.login(username, password).success(function (data) {

                    AuthenticationFactory.isLogged = true;
                    AuthenticationFactory.user = data.data.user.username;
                    AuthenticationFactory.userRole = data.data.user.role;
                    AuthenticationFactory.userId = data.data.user_id;

                    $window.sessionStorage.token = data.data.token;
                    $window.sessionStorage.user = data.data.user.username;
                    $window.sessionStorage.userRole = data.data.user.role;
                    $window.sessionStorage.userId = data.data.user.user_id;

                    $scope.user.username = '';
                    $scope.user.password = '';

                }).error(function(error) {
                    $scope.user.username = '';
                    $scope.user.password = '';
                    AlertFactory.add('danger', error.message);
                });
            } else {
                AlertFactory.add('danger','Please type username and password and try again!');
            }
        };

        $scope.logout = function() {
          UserAuthFactory.logout();
        };

        $scope.isLogged = function() {
            return AuthenticationFactory.isLogged;
        };

        $scope.getUsername = function() {
            return AuthenticationFactory.user;
        }

    }
]);
