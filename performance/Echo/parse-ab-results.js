var fs = require("fs");

var parseString = function (s) {
    return s.trim();
};
var parseNum = function (s) {
    return parseInt(s.trim().split(" ")[0], 10);
};
var parseDouble = function (s) {
    return parseFloat(s.trim().split(" ")[0]);
};

var handlers = {
    "Concurrency Level": parseNum,
    "Time taken for tests": parseDouble,
    "Complete requests": parseNum,
    "Failed requests": parseNum,
    "Requests per second": parseDouble,
    "Time per request": parseDouble,
};
var alias = {
    "Concurrency Level": 'threadCount',
    "Time taken for tests": 'totalMs',
    "Complete requests": 'completedTotal',
    "Failed requests": 'failedTotal',
    "Requests per second": 'requestsPerSec',
    "Time per request": 'msPerRequest',
};

var results = [];

fs.readdirSync("results").forEach(function (file) {
    var filePath = "results/" + file;
    if (fs.statSync(filePath).isDirectory()) return;

    var parts = file.split('-');
    var meta = parts[parts.length - 1].split('.');
//    console.log(file, meta);

    var contents = fs.readFileSync(filePath).toString();
    var lines = contents.replace(/\r/g, "").split("\n");

    var result = {
        'type': meta[1],
        'rowCount': meta[0]
    };

    lines.forEach(function (line) {
        var stat = line.split(":");
        if (stat.length <= 1) return;

        var key = stat[0],
            val = stat[1],
            handler = handlers[key];

        if (!handler) return;

        result[alias[key]] = handler(val);
    });

    if (!result['threadCount'])
        console.log("Error: ", file, ":\n\n" + contents);

    results.push(result);   
});

//console.log(results);

function getCsv(results) {
    var csv = "";
    results.forEach(function (result) {
        var keys = Object.keys(result);
        if (!csv) {
            var headers = "";
            keys.forEach(function (key) {
                if (headers)
                    headers += ",";
                headers += key;
            });
            csv += headers + "\n";
        }
        var values = "";
        keys.forEach(function (key) {
            if (values)
                values += ",";
            values += result[key];
        });
        csv += values + "\n";
    });
    return csv;
}

var pad2 = function(o) {
    var str = '' + o;
    while (str.length < 2) 
        str = '0' + str;    
    return str;
};
var now = new Date();
var dir = now.getFullYear() + "-" + pad2(now.getMonth() + 1) + "-" + pad2(now.getDate());

var resultsDir = "results/" + dir;
if (!fs.existsSync(resultsDir))
    fs.mkdirSync(resultsDir);

fs.writeFileSync(resultsDir + "/" + "results.csv", getCsv(results));
fs.writeFileSync(resultsDir + "/" + "results.json", JSON.stringify(results));
