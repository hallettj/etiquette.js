/*globals Protocol extend raises */

module("etiquette", {
    setup: function() {
        var myProto = Protocol({
            foo: false,
            bar: false,
            nao: function() { return "nao"; }
        });

        function MyType() {}

        extend(MyType, myProto, {
            foo: function() { return "foo"; }
        });

        this.myProto = myProto;
        this.MyType = MyType;
        this.myObj = new MyType();
    }
});

test("defines new behavior for a type", 1, function() {
    equal(this.myProto.foo(this.myObj), "foo", "returns 'foo'");
});

test("fails if a function has no implementation", 1, function() {
    var proto = this.myProto;
    var obj = this.myObj;
    raises(function() {
        proto.bar(obj);
    }, "throws an exception");
});

test("inherits default function implementations", 1, function() {
    equal(this.myProto.nao(this.myObj), "nao", "returns 'nao'");
});

test("overrides default function implementations", 1, function() {
    function AnotherType() {}
    extend(AnotherType, this.myProto, {
        nao: function() { return "custom nao"; }
    });

    var obj = new AnotherType();
    equal(this.myProto.nao(obj), "custom nao", "invokes custom function implementation");
});
