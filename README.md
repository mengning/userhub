# userhub
基于微信公众号的用户认证服务

## client userport.js

```
    <script src="userhub/socket.io.js"></script>
    <script src="userport.js"></script>
    <script>
        userport('http://localhost');
    </script>
    <link href="userport.css" rel="stylesheet" type="text/css"/>
```

## server userhub.js

```
const wechat = require('wechat');
var userhub = require('./userhub')
// 处理二维码扫码事件
userhub.scanTmpQRCode(message);
// 启动userhub
userhub.start(http);
```

## run 
```
npm install
node index.js
```
# Licensing

under [GNU GPL v3](/LICENSE) or 企业版请联系mengning997[AT]163.com
