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

        this.getUserData = function(userid) {
          return $q(function(resolve, reject) {
             if(userid) {
                 $http.get($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/api/users/' + userid)
                     .success(function (result) {
                         resolve(result);
                     })
                     .error(function (error) {
                         reject(error);
                     });
             }else {
                 reject('No userid');
             }
          });
        };

        this.updateUserData = function(userid, data) {
            return $q(function(resolve, reject) {
                $http.put($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/api/users/' + userid, data)
                    .success(function(result) {
                        resolve(result);
                    })
                    .error(function(error) {
                        reject(error);
                    });
            });
        };

        this.createUserData = function(data) {
            return $q(function(resolve, reject) {
                $http.post($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/api/users/', data)
                    .success(function (result) {
                        resolve(result);
                    })
                    .error(function(error) {
                        reject(error);
                    });
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
    }
]);