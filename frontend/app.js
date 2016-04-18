/**
 * Created by ekni on 19/03/16.
 */
var app = angular.module('app', ['ngResource', 'ui.bootstrap', 'ui.router', 'ncy-angular-breadcrumb'
]).
    config(['$stateProvider', '$httpProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $httpProvider, $urlRouterProvider, $locationProvider) {
        $httpProvider.interceptors.push('TokenInterceptor');
        $httpProvider.interceptors.push('UnAuthorizedResponseInterceptor');

        $locationProvider.html5Mode(true);

        $stateProvider
            .state('index', {
                url: "/",
                templateUrl: "views/main.html",
                controller: 'MainController',
                access: {
                    requireLogin: false,
                    preventIfLoggedIn: false
                },
                ncyBreadcrumb: {
                    label: 'Home'
                }
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'views/signup.html',
                controller: 'SignupController',
                access: {
                    requireLogin: false,
                    preventIfLoggedIn: true
                },
                ncyBreadcrumb: {
                    label: 'New Account'
                }
            })
            .state('my-account', {
                url: '/my-account',
                templateUrl:'views/my-account.html',
                controller: 'MyAccountController',
                access: {
                    requireLogin: true,
                    preventIfLoggedIn: false
                },
                ncyBreadcrumb: {
                    label: 'My Account'
                }
            })
            .state('matches', {
                url: '/matches',
                templateUrl: 'views/match-list.html',
                controller: 'MatchController',
                access: {
                    requireLogin: false,
                    preventIfLoggedIn: false
                },
                ncyBreadcrumb: {
                    label: 'Matches'
                }

            });
        $urlRouterProvider.otherwise("/");
}]);

app.run(function($rootScope, $window, $state, AuthenticationFactory, AlertFactory, $location) {

    AuthenticationFactory.check();

    $rootScope.$on('$stateChangeStart', function(event, nextState, currentState) {
        AlertFactory.clearAll();
        if(((nextState.access && nextState.access.requireLogin) && !AuthenticationFactory.isLogged) || (nextState.access.preventIfLoggedIn && AuthenticationFactory.isLogged)) {
            event.preventDefault();
            $state.go('index');
        } else {
            if(!AuthenticationFactory.user) AuthenticationFactory.user = $window.sessionStorage.user;
            if(!AuthenticationFactory.userRole) AuthenticationFactory.userRole = $window.sessionStorage.userRole;
            if(!AuthenticationFactory.userId) AuthenticationFactory.userID = $window.sessionStorage.userID;
        }
    });

    $rootScope.$on('$stateChangeSuccess', function(event, nextState, currentState) {
        $rootScope.role = AuthenticationFactory.userRole;
    });
});

