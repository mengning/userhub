const wechat = require('wechat');

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
    res.reply({ content: 'wellcome! ' + scanCode, type: 'text' });
}
wechatscan.start = function (app) {
    app.use('/wechat', wechat('wechat', wechatscan.message));
}
module.exports = wechatscan;