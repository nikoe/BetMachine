/**
 * Created by ekni on 19/03/16.
 */
app.controller('LoginController', ['$scope', '$window', '$location', 'UserAuthFactory', 'AuthenticationFactory', 'AlertFactory', '$state', '$rootScope',
    function ($scope, $window, $location, UserAuthFactory, AuthenticationFactory, AlertFactory, $state, $rootScope) {
        $scope.user = {
            username: '',
            password: ''
        };

        $scope.login = function () {
            AlertFactory.clearAll();
            var username = $scope.user.username,
                password = $scope.user.password;

            if ((username !== undefined && username.length > 0) && (password !== undefined && password.length > 0)) {
                UserAuthFactory.login(username, password).success(function (data) {

                    AuthenticationFactory.isLogged = true;
                    AuthenticationFactory.user = data.data.user.username;
                    AuthenticationFactory.userId = data.data.user_id;

                    $window.sessionStorage.token = data.data.token;
                    $window.sessionStorage.user = data.data.user.username;
                    $window.sessionStorage.userId = data.data.user.user_id;

                    if(data.data.user.role == 'ADMIN') {
                        AuthenticationFactory.isAdmin = true;
                        $window.sessionStorage.role = 'ADMIN';
                    }

                    $scope.user.username = '';
                    $scope.user.password = '';

                    $rootScope.$broadcast('loggedIn', '');

                    $state.go('index');

                }).error(function(error) {
                    $scope.user.username = '';
                    $scope.user.password = '';
                    AlertFactory.add('danger', error.message, 'fa fa-ban');
                });
            } else {
                AlertFactory.add('danger','Please type username and password and try again!', 'fa fa-ban');
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
