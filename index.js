module.exports = ipBlacklist;
module.exports.array = arrayCallback;
module.exports.file = fileCallback;
module.exports.chain = chainCallback;

const fs = require('fs'), ipaddr = require('ipaddr.js');

function ipBlacklist(callback) {
    // Return middleware function
    return function middleware(req, res, next) {
        const ip = req.ip || req.socket.remoteAddress;
        // Check if the IP is blacklisted
        const blacklisted = callback(ip);
        if (blacklisted) {
            // If blacklisted, end the request with code 403 (Forbidden)
            res.statusCode = 403;
            res.end('IP is blacklisted');
        } else next(); // Pass on to next middleware if not blacklisted
    }
}

function arrayCallback(array) {
    let ipAddresses = [];
    // Iterate through array and sort out invalid IPs
    array.forEach(el => {
        if (ipaddr.isValid(el)) ipAddresses.push(el);
    });
    return function (ip) {
        // Check if given IP is inside the array
        return ipAddresses.indexOf(ip) !== -1;
    }
}

function fileCallback(file) {
    // Read lines from file and pass them to the array callback
    return arrayCallback(fs.readFileSync(file).toString().split('\n'));
}

function chainCallback() {
    let callbacks = Array.prototype.slice.call(arguments);
    return function (ip) {
        // Iterate through all the callbacks and check if the IP is whitelisted. If that is the case,
        // return true, otherwise iterate through the rest and return false.
        for (let i = 0; i < callbacks.length; i++) if (callbacks[i](ip)) return true;
        return false;
    }
}