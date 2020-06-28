# userhub
基于微信公众号的用户认证服务插件，可用于桌面Web、桌面软件等场景的二维码扫码验证用户，及微信浏览器自动验证用户。

## client userport.js

```
    <script src="userhub/socket.io.js"></script>
    <script src="userport.js"></script>
    <script>
        userport('http://your-userhub-server');
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
