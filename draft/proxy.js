var Http = require('http');

var req = Http.request({
    host: 'www.demomkt.xyz',
    port: 3128,
    method: 'GET',
    path: 'https://www.google.com/'
    }, function (res) {
        res.on('data', function (data) {
        console.log(data.toString());
    });
});

req.end();
