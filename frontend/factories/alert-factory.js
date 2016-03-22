/**
 * Created by ekni on 22/03/16.
 */
app.factory('AlertFactory', ['$rootScope', function($rootScope) {
    var alertfactory = {};

    $rootScope.alerts = [];

    alertfactory.add = function(type, msg) {
        $rootScope.alerts.push({
            type: type,
            msg: msg,
            close: function() {
                return alertfactory.closeAlert(this);
            }
        });
    };

    alertfactory.closeAlertIdx = function(index) {
        $rootScope.alerts.splice(index, 1);
    };

    alertfactory.closeAlert = function(alert) {
        alertfactory.closeAlertIdx($rootScope.alerts.indexOf(alert));
    };

    alertfactory.clearAll = function() {
        $rootScope.alerts = [];
    };

    return alertfactory;
}]);