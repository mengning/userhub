const wechat = require('wechat');
var WechatAPI = require('co-wechat-api');
var socketio = require('socket.io');
const https = require('https');
const session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
});
const sharedsession = require("express-socket.io-session");
//临时二维码过期时间，单位秒。最大不超过1800
var expireNumber = 60;
var io = '';
const userhub = {}
userhub.scanQRCodes = [];
userhub.wechatapi = '';
userhub.scanQRCodeHandle = async function (socket, id) {
    if (userhub.scanQRCodes[0]) {
        console.log(userhub.scanQRCodes[0]);
        if (userhub.scanQRCodes[0].scanCode == id) {
            console.log(userhub.scanQRCodes[0].scanCode, id);
            var userdata = await userhub.wechatapi.getUser(userhub.scanQRCodes[0].FromUserName);
            console.log(userdata);
            socket.emit('login', userdata);
            socket.handshake.session.userdata = userdata;
            socket.handshake.session.save()
            userhub.scanQRCodes.pop();
        }
    }
}
// 生成一个临时二维码
userhub.createTmpQRCode = async function (socket) {
    try {
        var id = Math.floor(Math.random() * 900000) + 100000;
        result = await userhub.wechatapi.createTmpQRCode(id, expireNumber);
        var ticket = result['ticket']
        var url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + ticket

        socket.emit('qrcode', url, (data) => {
            console.log(data);
        });

        var monitorInterval = setInterval(userhub.scanQRCodeHandle,
            expireNumber / expireNumber * 1000, socket, id);
        setTimeout(() => {
            if (monitorInterval) {
                clearInterval(monitorInterval);
                monitorInterval = null;
            }
        }, expireNumber * 1000);

        return true;
    } catch (err) {
        console.error(err)
        return false
    }
}
// 扫码事件一个临时二维码
userhub.scanTmpQRCode = async function (message) {
    var scanCode = '';
    console.log(message);
    if (message.Event === 'subscribe') {
        var key = message.EventKey
        if (key.indexOf("qrscene_") !== -1) {
            var start = key.indexOf('qrscene_') + ('qrscene_'.length);
            scanCode = key.substring(start);
        }
    }
    if (message.MsgType === 'event' && message.Event === 'SCAN') {
        scanCode = message.EventKey;
    }
    if (scanCode && parseInt(scanCode, 10) > 100000) {
        userhub.scanQRCodes.push({ 'scanCode': scanCode, 'FromUserName': message.FromUserName });
    }
}
userhub.start = function (app, http, config) {
    // weixin api
    userhub.wechatapi = new WechatAPI(config.appid, config.appsecret);
    // websocket
    io = socketio(http, {
        path: '/' + config.username
    });
    // Attach session
    app.use(session);
    // Share session with io sockets
    io.use(sharedsession(session));

    io.on('connection', (socket) => {
        if(socket.handshake.session.userdata){
            socket.emit('login', socket.handshake.session.userdata);
        }else{
            userhub.createTmpQRCode(socket);
        }
        // when weixin browser login
        socket.on('wxcode', (data) => {
            console.log(data);
            var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + config.appid + '&secret=' + config.appsecret + '&code=' + data + '&grant_type=authorization_code'
            https.get(url, (res) => {
                console.log('statusCode:', res.statusCode);
                console.log('headers:', res.headers);
                res.on('data', (d) => {
                    console.log('' + d);//将buffer转为字符串或者使用d.toString()
                    let b = JSON.parse('' + d);//将buffer转成JSON
                    console.log(b.openid);
                    userhub.scanQRCodes.push({ 'scanCode': "100001", 'FromUserName': b.openid });
                    userhub.scanQRCodeHandle(socket, "100001");
                });
            });
        });
        socket.on("logout", function (userdata) {
            console.log(userdata);
            if (socket.handshake.session.userdata) {
                delete socket.handshake.session.userdata;
                socket.handshake.session.save();
            }
        });

    });
}
module.exports = userhub