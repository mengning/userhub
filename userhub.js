var wechatapi = require("./wechatapi");
const wechat = require('wechat');
var socketio = require('socket.io');
//临时二维码过期时间，单位秒。最大不超过1800
var expireNumber = 60;
var io = '';
const userhub = {}
userhub.scanQRCodes = [];
function scanQRCodeHandle(socket, id) {
    if(userhub.scanQRCodes[0]){
        console.log(userhub.scanQRCodes[0]);
        if(userhub.scanQRCodes[0].scanCode == id){
            console.log(userhub.scanQRCodes[0].scanCode, id);
            socket.emit('userverify', userhub.scanQRCodes[0].FromUserName, (data) => {
                console.log(data); 
            })
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
        setInterval(()=>{
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
userhub.start = function (http) {
    io = socketio(http, {
        path: '/myownpath'
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