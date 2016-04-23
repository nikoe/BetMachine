/**
 * Created by Niko on 18.4.2016.
 */

app.service('MatchService', ['$http', '$q', '$rootScope','$location', 'AuthenticationFactory', '$window',
    function($http, $q, $rootScope, $location, AuthenticationFactory, $window) {

        this.getAll = function() {
            return $q(function(resolve, reject) {
                $http.get($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/api/matches/')
                    .success(function (result) {
                        resolve(result);
                    })
                    .error(function (error) {
                        reject(error);
                    });
            });
        };

        this.findUpcomingMatchDates = function() {
            return $q(function(resolve, reject) {
                $http.get($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/api/matches/dates')
                    .success(function (result) {
                        resolve(result);
                    })
                    .error(function (error) {
                        reject(error);
                    });
            });
        };

        this.findUpcomingMatchesByDate = function(date) {
            return $q(function(resolve, reject) {
                $http.get($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/api/matches/dates/' + date)
                    .success(function (result) {
                        resolve(result);
                    })
                    .error(function (error) {
                        reject(error);
                    });
            });
        };

        this.deleteById = function(matchid) {
            return $q(function(resolve, reject) {
                if(AuthenticationFactory.isAdmin) {
                    $http.delete($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/api/matches/' + matchid)
                        .success(function (result) {
                            resolve(result);
                        })
                        .error(function (error) {
                            reject(error);
                        });
                }else {
                    reject({msg: 'Not authorized!'});
                }
            });
        };

        this.create = function(data) {
            return $q(function(resolve, reject) {
                if (AuthenticationFactory.isAdmin) {
                    data.creator_id = $window.sessionStorage.userId;

                    var close_time = new Date(data.start_time);
                    close_time.setMinutes(close_time.getMinutes() - 1);
                    data.close_time = close_time;

                    $http.post($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/api/matches/', data)
                        .success(function (result) {
                            resolve(result);
                        })
                        .error(function (error) {
                            reject(error);
                        });
                }else {
                    reject({msg: 'Not authorized!'});
                }
            });
        }
    }
]);
