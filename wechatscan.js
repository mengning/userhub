const wechat = require('wechat');
var scanList = require('./userhub').scanQRCodes;

const wechatscan = {};
wechatscan.message = async function (req, res, next) {
    var message = req.weixin;
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
    if(scanCode){
        scanList.push({'scanCode':scanCode, 'FromUserName':message.FromUserName});
    }
    res.reply({ content: 'wellcome! ' + scanCode, type: 'text' });
}
wechatscan.start = function (app) {
    app.use('/wechat', wechat('wechat', wechatscan.message));
}
module.exports = wechatscan;