const constants = require("../utils/constants");
const http = require('http');
const https = require('https');

var protocol = constants.PROTOCOL;
var httpClinet = https;

if (protocol == 'http') {
    httpClinet = http;
}

var get = function httpGet(host, port, path , headers) {

    var options = {
        host: host,
        port: port,
        path: path,
        method: 'GET',
        headers : headers
    }

    return new Promise((resolve, reject) => {
        var req = httpClinet.request(options, (resp) => {
            console.log("INFO : HTTP Communication . GET " + protocol + "://" + host + ":" + port + path );
            var returnData = "";
            // on succ
            resp.on('data', chunk => {
                returnData = returnData + chunk;
            });

            // on end
            resp.on('end', () => {
                var pop = JSON.parse(returnData);
                console.log("INFO : Response = " + JSON.stringify(pop));
                resolve(pop);
            });

        }).on("error", (err) => {
            console.error("ERR : HTTP Communication Failure . GET " + protocol + "://" + host + ":" + port + path + ". error = " + err);
            reject(err);
        });

        req.end();
    });
};

var post = function httpPost(host, port, path, payload , headersObj) {

    var headers = Object.assign({
        'Content-Type': 'application/json',
        'Content-Length': payload.length
    } , headersObj);

    var options = {
        host: host,
        port: port,
        path: path,
        method: 'POST',
        headers: headers
    }

    return new Promise((resolve, reject) => {
        var req = httpClinet.request(options, res => {
            console.log("INFO : HTTP Communication . POST " + protocol + "://" + host + ":" + port + path );
            res.setEncoding('utf8');
            var returnData = "";

            res.on('data', chunk => {
                returnData = returnData + chunk;
            });

            res.on('end', () => {
                var pop = JSON.parse(returnData);
                console.log("INFO : Response = " + JSON.stringify(pop));
                resolve(pop);
            });

        }).on("error", (err) => {
            console.error("ERR : HTTP Communication Failure . POST " + protocol + "://" + host + ":" + port + path + ". error = " + err);
            reject(err);
        });

        req.write(payload);
        req.end();
    });
}

exports.get = get;
exports.post = post;