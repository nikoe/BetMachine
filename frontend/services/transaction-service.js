/**
 * Created by Niko on 13.4.2016.
 */

app.service('TransactionService', ['$http', '$q', '$rootScope','$location',
    function($http, $q, $rootScope, $location) {
        this.getBalance = function(userid) {
            return $q(function(resolve, reject) {
                if(userid) {
                    $http.get($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/api/users/' + userid + '/balance')
                        .success(function (result) {
                            $rootScope.$broadcast('account:balance', result.balance);
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

        this.deposit = function(userid, data) {
            return $q(function(resolve, reject)  {

                if(Math.abs(data.amount) > 1000000) {
                    reject({msg: 'Maximum deposit amount is 1M €'});
                }else {
                    $http.post($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/api/transactions/' + userid, data)
                        .success(function(result) {
                            $rootScope.$broadcast('account:balance', result.balance);
                            resolve(result.balance);
                        })
                        .error(function(error) {
                            reject(error);
                        });
                }
            });
        };

        this.getTransactions = function(userid) {
            return $q(function(resolve, reject) {
                $http.get($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/api/transactions/' + userid)
                    .success(function(result) {
                        resolve(result);
                    })
                    .error(function(error) {
                        reject(error);
                    });
            });
        };
    }
]);