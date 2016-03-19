/**
 * Created by ekni on 19/03/16.
 */
var app = angular.module('app', [
    'ngRoute', 'ngResource', 'ui.bootstrap'
]).
    config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
        $httpProvider.interceptors.push('TokenInterceptor');
        $routeProvider
            .when('/', {
                controller: 'LoginController',
                templateUrl: 'views/main.html',
                access: {
                    requireLogin: false,
                    requireAdmin: false
                }
            })
            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'views/login.html',
                access: {
                    requireLogin: false,
                    requireAdmin: false
                }
            })
            .otherwise({
               redirectTo: '/login'
            });
}]);

app.run(function($rootScope, $window, $location, AuthenticationFactory) {

    AuthenticationFactory.check();

    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
        if((nextRoute.access && nextRoute.access.requireLogin) && !AuthenticationFactory.isLogged) {
            $location.path('/login');
        } else {
            if(!AuthenticationFactory.user) AuthenticationFactory.user = $window.sessionStorage.user;
            if(!AuthenticationFactory.userRole) AuthenticationFactory.userRole = $window.sessionStorage.userRole;
        }
    });

    $rootScope.$on('$routeChangeSuccess', function(event, nextRoute, currentRoute) {
        $rootScope.role = AuthenticationFactory.userRole;

        if(AuthenticationFactory.isLogged == true && $location.path() == '/login') {
            $location.path("/");
        }

    });
});
