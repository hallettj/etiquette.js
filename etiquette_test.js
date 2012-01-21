/*globals Protocol extend raises */

module("etiquette", {
    setup: function() {
        var myProto = Protocol({
            foo: false,
            bar: false
        });

        function MyType() {}

        extend(MyType, myProto, {
            foo: function() { return "foo"; }
        });

        this.myProto = myProto;
        this.MyType = MyType;
    }
});

test("fails if a function has no implementation", 1, function() {
    var obj = new this.MyType();
    raises(function() { this.myProto.bar(obj); }, "throws an exception");
});
