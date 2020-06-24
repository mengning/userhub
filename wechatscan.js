const wechat = require('wechat');

const wechatscan = {};
wechatscan.message = async function (req, res, next) {
    var message = req.weixin;
    console.log(message);
    res.reply({content:'wellcome!', type: 'text' });
}
wechatscan.start = function (app) {
    app.use('/wechat', wechat('wechat', wechatscan.message));
}
module.exports = wechatscan;