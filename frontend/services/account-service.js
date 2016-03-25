/**
 * Created by ekni on 25/03/16.
 */

app.service('AccountService', ['$http', '$q', '$rootScope','$location',
    function($http, $q, $rootScope, $location) {
        this.getBalance = function(userid) {
            return $q(function(resolve, reject) {
                if(userid) {
                    $http.get($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/api/users/' + userid + '/balance')
                        .success(function (result) {
                            resolve(result.balance);
                        })
                        .error(function (error) {
                            reject(error);
                        });
                }else {
                    reject('No userid');
                }
            });
        };
    }
]);