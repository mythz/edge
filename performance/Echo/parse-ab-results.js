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
var now = new Date();
var dateLabel = now.getFullYear() + "-" + pad2(now.getMonth() + 1) + "-" + pad2(now.getDate());

fs.readdirSync("results").forEach(function (file) {
    var filePath = "results/" + file;
    if (fs.statSync(filePath).isDirectory()) return;

    var parts = file.split('-');
    var meta = parts[parts.length - 1].split('.');
//    console.log(file, meta);

    var contents = fs.readFileSync(filePath).toString();
    var lines = contents.replace(/\r/g, "").split("\n");

    var result = {
        'name': parts[0],
        'dataType': meta[1],
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

function pad2(o) {
    var str = '' + o;
    while (str.length < 2) 
        str = '0' + str;    
    return str;
};

var resultsDir = "results/" + dateLabel;
if (!fs.existsSync(resultsDir))
    fs.mkdirSync(resultsDir);

fs.writeFileSync(resultsDir + "/" + "raw-results.csv", getCsv(results));
fs.writeFileSync(resultsDir + "/" + "raw-results.json", JSON.stringify(results));

var allStats = {
    node: {},
    edge: {},
    servicestack: {}
};

results.forEach(function(result) {
    var stats = allStats[result.name];
    var key = result.rowCount + " " + result.dataType;
    var currencyGroup = '' + result.threadCount;
    
    if (!stats[currencyGroup])
        stats[currencyGroup] = {};

    stats[currencyGroup][key] = result.totalMs;
});

function addToSeries(name, allSeries) {
    var typeStats = allStats[name];
    for (var threadCount in typeStats) {
        var stats = typeStats[threadCount];
        var series = {
            name: name + ' ' + threadCount + ' threads',
            data: [
                stats['1 txt'],
                stats['1 json'],
                stats['10 txt'],
                stats['10 json'],
                stats['100 txt'],
                stats['100 json']
            ]
        };
        allSeries.push(series);
    }
}

var allSeries = [];
addToSeries('node', allSeries);
addToSeries('edge', allSeries);
addToSeries('servicestack', allSeries);

fs.writeFileSync("charts/" + dateLabel + "-echo-benchmarks.json", JSON.stringify(allSeries));

var html = ['<html><head><title>' + dateLabel + ' edge vs node.js performance</title></head>',
    '<body>',
    '<script src="jquery-1.7.js"></script>',
    '<script src="highcharts.js"></script>',
    '<script src="exporting.js"></script>',
    '<div id="container" style="min-width: 800px; height: 800px; margin: 0 auto"></div>',
    '<script type="text/javascript">',
    '    var series = ' + JSON.stringify(allSeries) + ';',
    '    $(function () {',
    '        $("#container").highcharts({',
    '            chart: {',
    '                type: "line"',
    '            },',
    '            title: {',
    '                text: "node vs edge perf passing Nortwhind Customer rows"',
    '            },',
    '            subtitle: {',
    '                text: "10k iterations"',
    '            },',
    '            xAxis: {',
    '                categories: ["1 text row", "1 json row", "10 text rows", "10 json rows", "100 text rows", "100 json rows"]',
    '            },',
    '            yAxis: {',
    '                title: {',
    '                    text: "Total Time Taken (ms)"',
    '                },',
    '                plotLines: [{',
    '                    value: 0,',
    '                    width: 1,',
    '                    color: "#808080"',
    '                }]',
    '            },',
    '            tooltip: {',
    '                valueSuffix: "ms"',
    '            },',
    '            legend: {',
    '                layout: "vertical",',
    '                align: "right",',
    '                verticalAlign: "top",',
    '                y: 100,',
    '                borderWidth: 0',
    '            },',
    '            series: series',
    '        });',
    '    });',
    '</script>',
    '</body>',
    '</html>'];

fs.writeFileSync("charts/" + dateLabel + "-echo-benchmarks.html", html.join('\n'));
