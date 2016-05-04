/**
 * Created by Niko on 4.5.2016.
 */

app.factory('BetslipFactory', ['$window', 'AlertFactory', '$rootScope', function($window, AlertFactory, $rootScope) {
    var betslip = {
        _matches: {},

        addOdd: function(odd) {
            if(!this._matches.hasOwnProperty(odd.match_id)) {

                var oddData = {
                    name: odd.match_name,
                    match_id: odd.match_id,
                    mark: odd.name,
                    odd: odd.factor,
                    id: odd.odd_id
                }

                this._matches[odd.match_id] = oddData;

                $rootScope.$broadcast("betslip:totalodds", this.getTotalOdds());

            }else {
                AlertFactory.clearAll();
                AlertFactory.add('danger', 'Match is already in betslip!', 'fa fa-ban');
            }
        },

        deleteOdd: function(match_id) {
            if(this._matches.hasOwnProperty(match_id)) {
                delete this._matches[match_id];
                $rootScope.$broadcast("betslip:totalodds", this.getTotalOdds());
            }
        },

        getOdds: function() {
            return this._matches;
        },

        getTotalOdds: function() {
            var total = 0.00;

            var keys = Object.keys(this._matches);

            for(i = 0; i < keys.length; i++) {
                if(i == 0) {
                    total = this._matches[keys[i]].odd;
                }else {
                    total = total * this._matches[keys[i]].odd;
                }

            }

            return total;
        }
    };

    return betslip;
}]);