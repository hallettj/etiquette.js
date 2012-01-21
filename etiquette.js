function Protocol(signatures) {
    var impls = {};  // { Type: Function }

    var instance = this instanceof Protocol ? this : Object.create(Protocol.prototype);

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
        instance[funcName] = function(object) {
            var impl = findImpl(object);
            var func = impl[funcName];

            if (func) {
                return func.apply(null, arguments);
            } else if (typeof signatures[funcName] === 'function') {
                return signatures[funcName].apply(null, arguments);
            } else {
                throw "no implementation for '"+ funcName +"'";
            }
        };
    });

    instance.impls = impls;

    return instance;
}

function extend(type, protocol, impls) {
    protocol.impls[type] = impls;
}


// usage:

var Ord = Protocol({
    lt: function(a, b) { return Ord.compare(a, b) < 0; },
    gt: function(a, b) { return Ord.compare(a, b) > 0; },
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
