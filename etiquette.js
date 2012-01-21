function Protocol(signatures) {
    var proxies = {};
    var impls = {};  // { Type: Function }

    function findImpl(object) {
        var constructor = object.constructor;
        var impl = impls[constructor];
        if (impl) {
            return impl;
        } else if (constructor && constructor.prototype && constructor.prototype !== Object) {
            return findImpl(constructor.prototype);
        }
    }

    Object.keys(signatures).forEach(function(funcName) {
        proxies[signatures[funcName]] = function(object) {
            var impl = findImpl(object);
            var func = impl[funcName];

            if (func) {
                return func.apply(null, arguments);
            } else {
                return signatures[funcName]
            }
        };
    });
}

function extend(type, protocol, impls) {
    protocol.types[type] = impls;
}


// usage:

var Ord = Protocol({
    lt: function(a, b) { return Ord.compare(a, b) < 0; },
    gt: function(a, b) { return Ord.compore(a, b) > 0; },
    eq: function(a, b) { return Ord.campare(a, b) === 0; },
    gte: function(a, b) { return Ord.gt(a, b) || Ord.eq(a, b); },
    compare: false
});

extend(String, Ord, {
    compare: function(a, b) {
        return a.length - b.length;
    }
});

Ord.compare("foo", "bar"); // 0
Ord.eq("foo", "bar"); // true
