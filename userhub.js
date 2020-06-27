var wechatapi = require("./wechatapi");
const wechat = require('wechat');
var socketio = require('socket.io');
//临时二维码过期时间，单位秒。最大不超过1800
var expireNumber = 60;
var io = '';
const userhub = {}
userhub.scanQRCodes = [];
scanQRCodeHandle = async function (socket, id) {
    if(userhub.scanQRCodes[0]){
        console.log(userhub.scanQRCodes[0]);
        if(userhub.scanQRCodes[0].scanCode == id){
            console.log(userhub.scanQRCodes[0].scanCode, id);
            var userInfo = await wechatapi.getUser(userhub.scanQRCodes[0].FromUserName); 
            console.log(userInfo);
            socket.emit('userverify', userInfo, (data) => {
                console.log(data); 
            });
            userhub.scanQRCodes.pop();
        }
    }
}
// 生成一个临时二维码
userhub.createTmpQRCode = async function (socket) {
    try {
        var id = Math.floor(Math.random()*900000) + 100000;
        result = await wechatapi.createTmpQRCode(id, expireNumber);
        var ticket = result['ticket']
        var url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + ticket

        socket.emit('server', url, (data) => {
            console.log(data); 
        });
        
        var monitorInterval = setInterval(scanQRCodeHandle,
            expireNumber/expireNumber * 1000, socket, id);
        setTimeout(()=>{
            if(monitorInterval){    
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
    if(scanCode && parseInt(scanCode, 10) > 100000){
        userhub.scanQRCodes.push({'scanCode':scanCode, 'FromUserName':message.FromUserName});
    }
}
userhub.start = function (http) {
    io = socketio(http, {
        path: '/userhub'
    });
    io.on('connection', (socket) => {
        console.log(socket.id);
        socket.on('client', (data, fn) => {
            console.log(data);
            fn('callback a client function');
        });
        userhub.createTmpQRCode(socket);
    });
}
module.exports = userhub