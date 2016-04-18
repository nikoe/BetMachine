/**
 * Created by Niko on 18.4.2016.
 */

app.service('MatchService', ['$http', '$q', '$rootScope','$location',
    function($http, $q, $rootScope, $location) {

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
                $http.delete($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/api/matches/' + matchid)
                    .success(function (result) {
                        resolve(result);
                    })
                    .error(function (error) {
                        reject(error);
                    });
            });
        };
    }
]);
