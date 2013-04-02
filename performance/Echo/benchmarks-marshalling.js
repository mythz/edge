var edge = require('edge');
var fs = require('fs');
var async = require('async');


var deserializeJson = edge.func({
    assemblyFile: 'bin/Release/Echo.dll',
    typeName: 'Echo.Startup',
    methodName: 'DeserializeJson'
});
var deserializeObject = edge.func({
    assemblyFile: 'bin/Release/Echo.dll',
    typeName: 'Echo.Startup',
    methodName: 'DeserializeObject'
});

var TIMES = 10000;

var str1 = fs.readFileSync("row-1.txt"),
    str10 = fs.readFileSync("row-10.txt"),
    str100 = fs.readFileSync("row-100.txt"),
    json1 = JSON.parse(str1),
    json10 = JSON.parse(str10),
    json100 = JSON.parse(str100);

var fns = [];

function run(fn, times, cb) {
    var start = Date.now();

    var called = 0;
    for (var i = 0; i < times; i++) {
        fn(function() {
            if (++called == times) {
                var takenMs = Date.now() - start;
                cb(takenMs);
            }
        });
    }
}

function bench(jsonFn, objectFn, msg, cb) {
    console.log("running " + msg + "...\n");
    
    run(jsonFn, TIMES, function (jsonTakenMs) {
        run(objectFn, TIMES, function (objectTakenMs) {

            console.log(msg + " " + TIMES + " times: ");
            console.log("jsonStringToType: " + jsonTakenMs + "ms");
            console.log("jsToObjectToType: " + objectTakenMs + "ms");
            console.log((objectTakenMs > jsonTakenMs ? "jsToObjectToType" : "jsonStringToType") + " is " +
                Math.round(Math.max(jsonTakenMs, objectTakenMs) / Math.min(jsonTakenMs, objectTakenMs), 3) + "x slower\n");
            cb();
        });
    });
}

var jsonStringToType = function (input) {
    return function (cb) {
        deserializeJson(input, function (err, result) {
            cb();
        });
    };
};

var jsToObjectToType = function (input) {
    return function (cb) {
        deserializeObject(input, function (err, result) {
            cb();
        });
    };
};

async.series([
    function (cb) { bench(jsonStringToType(str1), jsToObjectToType(json1), "1 Northwind Customer", cb); },
    function (cb) { bench(jsonStringToType(str10), jsToObjectToType(json10), "10 Northwind Customers", cb); },
    function (cb) { bench(jsonStringToType(str100), jsToObjectToType(json100), "100 Northwind Customers", cb); }
]);
