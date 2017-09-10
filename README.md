# ip-blacklist [![Build Status](https://img.shields.io/travis/mbrandau/ip-blacklist.svg)](https://travis-ci.org/mbrandau/ip-blacklist) [![David](https://img.shields.io/david/mbrandau/ip-blacklist.svg)](https://david-dm.org/mbrandau/ip-blacklist) [![Coveralls](https://img.shields.io/coveralls/mbrandau/ip-blacklist.svg)](https://coveralls.io/github/mbrandau/ip-blacklist) [![npm](https://img.shields.io/npm/v/ip-blacklist.svg)](https://www.npmjs.com/package/ip-blacklist) [![npm](https://img.shields.io/npm/dt/ip-blacklist.svg)](https://www.npmjs.com/package/ip-blacklist) [![GitHub issues](https://img.shields.io/github/issues/mbrandau/ip-blacklist.svg)](https://github.com/mbrandau/ip-blacklist/issues)
Basic middleware for blacklisting ip addresses

## Usage

Install and save the package to your project `npm i --save ip-blacklist`

```js
const ipBlacklist = require('ip-blacklist'), path = require('path');

// Use the predefined array callback
// NOTE: Changes in the array you pass to ipBlacklist.array will not be considered!
app.use(ipBlacklist(ipBlacklist.array(['127.0.0.1', '::1'])));

// Use the predefined file callback
// NOTE: One line in the file represents an IP address
app.use(ipBlacklist(ipBlacklist.file(path.join(__dirname, 'blacklist.txt'))));

// Create your own callback
app.use(ipBlacklist(ip => {
    return ip === '192.168.178.1' || ip === '192.168.178.2';
}));

// Chain multiple callbacks
app.use(ipBlacklist(ipBlacklist.chain(
    ipBlacklist.file(path.join(__dirname, 'blacklist-a.txt')),
    ipBlacklist.file(path.join(__dirname, 'blacklist-b.txt'))
)));
```

### More advanced usage

```js
const ipBlacklist = require('ip-blacklist');

let blacklist = [];

app.use(ipBlacklist(ip => {
    return blacklist.indexOf(ip) !== -1;
}));
app.post('/api/blacklist/:ip', (req, res) => {
    blacklist.push(req.params.ip);
    res.end('Added IP to blacklist');
});
app.get('/api/blacklist', (req, res) => {
    res.json(blacklist);
});
```
