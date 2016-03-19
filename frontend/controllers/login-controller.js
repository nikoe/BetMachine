/**
 * Created by ekni on 19/03/16.
 */
app.controller('LoginController', ['$scope', '$window', '$location', 'UserAuthFactory', 'AuthenticationFactory',
    function ($scope, $window, $location, UserAuthFactory, AuthenticationFactory) {
        $scope.user = {
            username: 'test',
            password: 'test'
        };

        $scope.error = '';

        $scope.login = function () {
            var username = $scope.user.username,
                password = $scope.user.password;

            if (username !== undefined && password !== undefined) {
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
                    $scope.error = 'Invalid credentials';
                });
            } else {
                $scope.error = 'Please type username and password and try again!';
            }
        }
    }
]);
