var edge = require('edge');
var http = require('http');

var netProxy = edge.func('Echo/bin/Release/Echo.dll');

var express = require('express');
var app = express();

app.use(function (req, res, next) {
    var data = '';
    req.setEncoding('utf8');
    req.on('data', function (chunk) {
        data += chunk;
    });

    req.on('end', function () {
        req.body = data;
        next();
    });
});
app.get('/', function (req, res) {
    res.send('hello world');
});
app.get('/api', function (req, res) {
    netProxy(toArgs(req), function (err, result) {
        res.set('Content-Type', 'text/plain');
        res.send(result);
    });
});


//node.js
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<p>Hello World</p>');
    res.end();
}).listen(8080);

app.listen(3000);
http.listen(3001);



function toArgs(req) {
    var args = {
        headers: req.headers,
        body: req.body,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path,
        host: req.host,
        protocol: req.protocol,
        secure: req.secure,
        subdomains: req.subdomains,
        originalUrl: req.originalUrl,
        acceptedLanguages: req.acceptedLanguages,
        acceptedCharsets: req.acceptedCharsets
    };
    //console.log("toArgs(): ", args);
    return args;
}
