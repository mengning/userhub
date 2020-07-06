var config = require("./config");
var WechatAPI = require('co-wechat-api');
const wechatapi = new WechatAPI(config.appid, config.appsecret);
//临时二维码过期时间，单位秒。最大不超过1800
var expireNumber = 60;
const qrcode = {}
// 生成一个临时二维码
qrcode.createTmpQRCode = async function (req, res, next) {
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
module.exports = qrcode;
