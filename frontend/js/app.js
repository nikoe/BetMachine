/**
 * Created by ekni on 19/03/16.
 */
var app = angular.module('app', ['ngResource', 'ui.bootstrap', 'ui.router', 'ncy-angular-breadcrumb', 'ui.bootstrap.datetimepicker'
]).
    config(['$stateProvider', '$httpProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $httpProvider, $urlRouterProvider, $locationProvider) {
        $httpProvider.interceptors.push('TokenInterceptor');
        $httpProvider.interceptors.push('UnAuthorizedResponseInterceptor');

        $stateProvider
            .state('index', {
                url: "/",
                templateUrl: "../views/main.html",
                controller: 'MainController',
                access: {
                    requireLogin: false,
                    preventIfLoggedIn: false,
                    requireAdmin: false
                },
                ncyBreadcrumb: {
                    label: 'Home'
                }
            })
            .state('signup', {
                url: '/signup',
                templateUrl: '../views/signup.html',
                controller: 'SignupController',
                access: {
                    requireLogin: false,
                    preventIfLoggedIn: true,
                    requireAdmin: false
                },
                ncyBreadcrumb: {
                    label: 'New Account'
                }
            })
            .state('my-account', {
                url: '/my-account',
                templateUrl:'../views/my-account.html',
                controller: 'MyAccountController',
                access: {
                    requireLogin: true,
                    preventIfLoggedIn: false,
                    requireAdmin: false
                },
                ncyBreadcrumb: {
                    label: 'My Account'
                }
            })
            .state('matches', {
                abstract: true,
                url: '/matches',
                template: '<ui-view />'
            })
            .state('matches.list', {
                url: '',
                templateUrl: '../views/match-list.html',
                controller: 'MatchController',
                access: {
                    requireLogin: false,
                    preventIfLoggedIn: false,
                    requireAdmin: false
                },
                ncyBreadcrumb: {
                    label: 'Matches'
                }

            })
            .state('matches.new', {
                url: '/new',
                templateUrl: '../views/match-new.html',
                controller: 'MatchController',
                access: {
                    requireLogin: false,
                    preventIfLoggedIn: false,
                    requireAdmin: true
                },
                ncyBreadcrumb: {
                    parent: 'matches.list',
                    label: 'New'
                }

            });
        $urlRouterProvider.otherwise("/");
        //$locationProvider.html5Mode(true);
}]);

app.run(function($rootScope, $window, $state, AuthenticationFactory, AlertFactory, $location) {

    AuthenticationFactory.check();

    $rootScope.$on('$stateChangeStart', function(event, nextState, currentState) {
        AlertFactory.clearAll();
        if(((nextState.access && nextState.access.requireLogin) && !AuthenticationFactory.isLogged) ||
            (nextState.access.preventIfLoggedIn && AuthenticationFactory.isLogged) ||
            (nextState.access.requireAdmin && !AuthenticationFactory.isAdmin)) {
                event.preventDefault();
                $state.go('index');
        } else {
            if(!AuthenticationFactory.user) AuthenticationFactory.user = $window.sessionStorage.user;
            if(!AuthenticationFactory.userId) AuthenticationFactory.userID = $window.sessionStorage.userID;

            if($window.sessionStorage.role == 'ADMIN') {
                AuthenticationFactory.isAdmin = true;
            }

        }
    });

    $rootScope.$on('$stateChangeSuccess', function(event, nextState, currentState) {
        $rootScope.role = AuthenticationFactory.userRole;
    });
});

