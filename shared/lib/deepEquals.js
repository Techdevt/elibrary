import _ from 'lodash';

export default function(arr1, arr2) {
    _.mixin({
        deepEquals: function(ar1, ar2) {
            var still_matches, _fail,
                _this = this;
            if (!((_.isArray(ar1) && _.isArray(ar2)) || (_.isObject(ar1) && _.isObject(ar2)))) {
                return false;
            }
            if (ar1.length !== ar2.length) {
                return false;
            }
            still_matches = true;
            _fail = function() {
                still_matches = false;
            };
            _.each(ar1, function(prop1, n) {
                var prop2;
                prop2 = ar2[n];

                if (prop1 !== prop2 && !_.deepEquals(prop1, prop2)) {
                    _fail();
                }
            });
            return still_matches;
        }
    });

    return _.deepEquals(arr1, arr2);
}
