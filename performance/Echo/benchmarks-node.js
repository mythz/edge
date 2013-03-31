var edge = require('edge');
var http = require('http');

var edgeInvoke = edge.func('bin/Release/Echo.dll');
var nodeInvoke = function(input, cb) {
    cb(null, input);
};

function readBody(req, res, cb) {
    if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            cb(body);
        });
    } else {
        cb(null);
    }
}

var handlers = {
    'node': sendTo(nodeInvoke),
    'edge': sendTo(edgeInvoke),
    '404': function(req, res) {
        res.writeHeader(404, { "Content-Type": "text/plain" });
        res.write("no handler for " + req.url);
        res.end();
    }
};
var counter = 0;
var errors = 0;
var last = null;
var lastError = null;

function sendTo(invoke) {
    return function (req, res) {
        try {
            
            readBody(req, res, function (body) {
                var asJson = req.url.indexOf("json") >= 0;
                var verbose = req.url.indexOf("verbose") >= 0;
                var data = asJson ? body : JSON.parse(body);

                invoke(data, function (err, result) {
                    var safeResult = (result || ""),
                        safeData = (data || "");
                    var status = safeResult.length == safeData.length ? 200 : 500;
                    res.writeHeader(status, { "Content-Type": "text/plain" });
                    
                    if (verbose) {
                        var current = "#" + (counter++) +
                            "\ntype: " + (asJson ? "json" : "txt") +
                            "\nlength: " + safeResult.length +
                            "\nstartsWith: " + safeResult.substring(0, 20) + "...";

                        res.write(current);
                        res.write("total errors: " + errors + ", lastError: " + lastError + "\n");
                        res.write("\n\n#LAST\n" + last);
                    }

                    last = current;
                    lastError = null;
                    
                    res.end();
                });
            });
            
        } catch (e) {
            errors++;
            res.writeHeader(500, { "Content-Type": "text/plain" });
            res.write("\ntotal: " + errors);
            res.write("\nerror: " + e);
            res.write("\nlastError: " + lastError);
            res.end();
            lastError = e;
        }
    };
}

http.createServer(function (req, res) {
    var parts = req.url.substring(1).split('/');
    var name = parts[0];
    var handler = handlers[name] || handlers['404'];
    handler(req, res);
})
.listen(3000);
