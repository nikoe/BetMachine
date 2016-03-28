/**
 * Created by ekni on 19/03/16.
 */
app.factory('AuthenticationFactory', function($window) {
    var auth = {
        isLogged: false,

        check: function() {
            if($window.sessionStorage.token && $window.sessionStorage.user) {
                this.isLogged = true;
            }else {
                this.isLogged = false;
                delete this.user;
            }
        }
    };

    return auth;
});

app.factory('UserAuthFactory', function($window, $location, $http, AuthenticationFactory, $state) {
    return {
        login: function(username, password) {
            return $http.post($location.protocol() +'://' + $location.host() + ':' + $location.port() + '/api/auth', {
                username: username,
                password: password
            });
        },
        logout: function() {
            if(AuthenticationFactory.isLogged) {
                AuthenticationFactory.isLogged = false;
                delete AuthenticationFactory.user;
                delete AuthenticationFactory.userRole;
                delete AuthenticationFactory.userId;
                delete $window.sessionStorage.token;
                delete $window.sessionStorage.user;
                delete $window.sessionStorage.userRole;
                delete $window.sessionStorage.userId;

                $state.go("index");
            }
        }
    }

});

app.run(['$state', function ($state) {}])

app.factory('TokenInterceptor', function($q, $window) {
   return {
       request: function(config) {
           config.headers = config.headers || {};
           if($window.sessionStorage.token) {
               config.headers['X-Access-Token'] = $window.sessionStorage.token;
               config.headers['X-Key'] = $window.sessionStorage.userId;
               config.headers['Content-Type'] = 'application/json';
           }

           return config || $q.when(config);
       },
       response: function(response) {
           return response || $q.when(response);
       }
   }
});

app.factory('UnAuthorizedResponseInterceptor',['$q','$injector',function($q, $injector){
    return {
        responseError: function(response){
            if(response.status === 401) {
                var UserAuthFactory = $injector.get("UserAuthFactory");
                UserAuthFactory.logout();
                return $q.reject(response);
            }else {
                return $q.reject(response);
            }
        }
    }
}]);