const constants = require("../utils/constants");
const http = require('http');
const https = require('https');

var protocol = constants.PROTOCOL;
var httpClinet = https;

if(protocol == 'http'){
    httpClinet = http;
}

var get = function httpGet(host , port , path) {

    var options = {
        host: host,
        port : port,
        path: path ,
        method: 'GET'
    }

    return new Promise((resolve, reject) => {
        var req = httpClinet.request(options, (resp) => {
            var returnData = "";
            // on succ
            resp.on('data', chunk => {
                returnData = returnData + chunk;
            });

            // on end
            resp.on('end', () => {
                var pop = JSON.parse(returnData);
                resolve(pop);
            });

        }).on("error", (err) => {
            console.log("Error occured during GET " + host + query + " API call => " + error);
            reject(error);
        });

        req.end();
    });
};

var post = function httpPost( host, port , path , payload) {

    var options = {
        host: host,
        port : port,
        path: path ,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': payload.length
        }
    }

    return new Promise((resolve, reject) => {
        var req = httpClinet.request(options, res => {
            res.setEncoding('utf8');
            var returnData = "";

            res.on('data', chunk => {
                returnData = returnData + chunk;
            });

            res.on('end', () => {
                var pop = JSON.parse(returnData);
                resolve(pop);
            });

            res.on("error", (error) => {
                console.log("Error occured during POST " + host + path + " API call => " + error);
                reject(error);
            });
        });

        req.write(payload);
        req.end();
    });
}

exports.get = get;
exports.post = post;