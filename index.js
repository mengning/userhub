var app = require('express')();
var http = require('http').createServer(app);

var wechatscan = require('./wechatscan');
var qrcode = require('./qrcode');
var userhub = require('./userhub');

app.get('/', (req, res) => {
    //res.send('<h1>Hello world</h1>');
    res.sendFile(__dirname + '/index.html');
});
app.get('/qrcode', (req, res) => {
    qrcode.createTmpQRCode(req, res);
})
wechatscan.start(app);
userhub.start(http);

http.listen(80, () => {
    console.log('listening on *:80');
});
