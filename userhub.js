var wechatapi = require("./wechatapi");
const wechat = require('wechat');
var socketio = require('socket.io');
//临时二维码过期时间，单位秒。最大不超过1800
var expireNumber = 60;
const userhub = {}
// 生成一个临时二维码
userhub.createTmpQRCode = async function (req, res, next) {
    try {
        var id = Math.floor(Math.random()*900000) + 100000;
        result = await wechatapi.createTmpQRCode(id, expireNumber);
        var ticket = result['ticket']
        var url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + ticket

        res.send('<img src='+ url + '></img>');
        return true;
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err })
        return false
    }
}
userhub.start = function (http) {
    var io = socketio(http, {
        path: '/myownpath'
    });
    io.on('connection', (socket) => {
        console.log(socket.id);
        socket.on('client', (data, fn) => {
            console.log(data);
            fn('callback a client function');
        });
        socket.emit('server', 'data to client', (data) => {
            console.log(data); 
        });
    });
}
module.exports = userhub