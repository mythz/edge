var edge = require('edge');
var fs = require('fs');
var async = require('async');

var edgeInvoke = edge.func('bin/Release/Echo.dll');
var nodeInvoke = function(input, cb) {
    cb(null, input);
};

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

    while (--times >= 0) {
        fn(function() {
            if (times == 0) {
                var takenMs = Date.now() - start;
                cb(takenMs);
            }
        });
    }
}

function bench(nodeFn, edgeFn, msg, cb) {
    console.log("running " + msg + "...\n");
    
    run(nodeFn, TIMES, function(nodeTakenMs) {
        run(edgeFn, TIMES, function (edgeTakenMs) {

            console.log(msg + " " + TIMES + " times: ");
            console.log("node: " + nodeTakenMs + "ms");
            console.log("edge: " + edgeTakenMs + "ms");
            console.log((edgeTakenMs > nodeTakenMs ? "edge" : "node") + " is " +
                Math.round(Math.max(nodeTakenMs, edgeTakenMs) / Math.min(nodeTakenMs, edgeTakenMs), 3) + "x slower\n");
            cb();
        });
    });
}

var nodeWith = function(input) {
    return function(cb) {
        nodeInvoke(input, function(err, result) {
            cb();
        });
    };
};

var edgeWith = function(input) {
    return function(cb) {
        edgeInvoke(input, function(err, result) {
            cb();
        });
    };
};

async.series([
    function (cb) { bench(nodeWith(str1), edgeWith(str1), "1 Northwind Customer.txt", cb); },
    function (cb) { bench(nodeWith(str10), edgeWith(str10), "10 Northwind Customer.txt", cb); },
    function (cb) { bench(nodeWith(str100), edgeWith(str100), "100 Northwind Customer.txt", cb); },
    function (cb) { bench(nodeWith(json1), edgeWith(json1), "1 Northwind Customer.json", cb); },
    function (cb) { bench(nodeWith(json10), edgeWith(json10), "10 Northwind Customer.json", cb); },
    function (cb) { bench(nodeWith(json100), edgeWith(json100), "100 Northwind Customer.json", cb); }
]);
