/**
 * Created by ekni on 19/03/16.
 */
var app = angular.module('app', [
    'ngRoute', 'ngResource', 'ui.bootstrap'
]).
    config(['$routeProvider', '$httpProvider', '$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {
        $httpProvider.interceptors.push('TokenInterceptor');
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
        $routeProvider
            .when('/', {
                controller: 'MainController',
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
               redirectTo: '/'
            });
}]);

app.run(function($rootScope, $window, $location, AuthenticationFactory, AlertFactory) {

    AuthenticationFactory.check();

    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
        AlertFactory.clearAll();
        if((nextRoute.access && nextRoute.access.requireLogin) && !AuthenticationFactory.isLogged) {
            $location.path("/");
        } else {
            if(!AuthenticationFactory.user) AuthenticationFactory.user = $window.sessionStorage.user;
            if(!AuthenticationFactory.userRole) AuthenticationFactory.userRole = $window.sessionStorage.userRole;
            if(!AuthenticationFactory.userId) AuthenticationFactory.userID = $window.sessionStorage.userID;
        }
    });

    $rootScope.$on('$routeChangeSuccess', function(event, nextRoute, currentRoute) {
        $rootScope.role = AuthenticationFactory.userRole;
    });
});
