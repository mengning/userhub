const wechat = require('wechat');
var userhub = require('./userhub');

const wechatscan = {};
wechatscan.message = async function (req, res, next) {
    var message = req.weixin;
    userhub.scanTmpQRCode(message);
    res.reply({ content: 'wellcome! ' + message.EventKey, type: 'text' });
}
wechatscan.start = function (app) {
    app.use('/wechat', wechat('wechat', wechatscan.message));
}
module.exports = wechatscan;