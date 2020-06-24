var wechatapi = require("./wechatapi")

const qrcode = {}
// 生成一个临时二维码
qrcode.createTmpQRCode = async function (req, res, next) {
    try {
        result = await wechatapi.createTmpQRCode(100001, 60);
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
