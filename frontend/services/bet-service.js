/**
 * Created by Niko on 5.5.2016.
 */

app.service('BetService', ['$http', '$q', '$rootScope', 'TransactionService', '$location',
    function($http, $q, $rootScope, TransactionService, $location) {
        this.create = function(data) {
            return $q(function(resolve, reject) {
                $http.post($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/api/bets/', data)
                    .success(function(result) {
                        TransactionService.getBalance(data.user_id);
                        resolve(result);
                    })
                    .error(function(error) {
                        reject(error);
                    });
            });
        }
    }
]);
