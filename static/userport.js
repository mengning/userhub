function whatBrowser() {
    var ua = window.navigator.userAgent.toLowerCase();
    var ua = navigator.userAgent.toLowerCase();  //获取用户端信息
    var info = {
        ie: /msie/.test(ua) && !/opera/.test(ua),  //匹配IE浏览器
        op: /opera/.test(ua),  //匹配Opera浏览器
        sa: /version.*safari/.test(ua),  //匹配Safari浏览器
        ch: /chrome/.test(ua),  //匹配Chrome浏览器
        ff: /gecko/.test(ua) && !/webkit/.test(ua)  //匹配Firefox浏览器
    };
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return "weixin";
    }
    if (info.ie) return "IE";
    if (info.op) return "Opera";
    if (info.sa) return "Safari";
    if (info.ch) return "Chrome";
    if (info.ff) return "Firefox";
    return "Unknow";
}

function show()  //显示隐藏层和弹出层
{
    $('#myModal').modal('show')
}
function hide()  //去除隐藏层和弹出层
{
    $('#myModal').modal('hide');
}

function qrcodeTimeout() {
    document.getElementById("info").innerHTML =
        '<p onclick="window.location.reload()">二维码超时，请刷新页面重试！</p>';
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
const userport = {};
userport.connect = function (url, username) {

    var browser = whatBrowser();
    var wxcode = null;
    if(browser == "weixin"){
        //获取微信code
        wxcode = getQueryString('code');
        if(wxcode == null){
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx21d8c47fbc68af9d&redirect_uri='+window.location.href+'&response_type=code&scope=snsapi_base&state=123#wechat_redirect'; 
        }
    }
    document.getElementById("browser").innerHTML = browser;

    const socket = io(url, {
        path: '/'+username,
        transports: ['websocket', 'polling']
    });
    userport.socket = socket;

    socket.on('connect', () => {
        console.log(socket.id); // 'G5p5...'
    });
    socket.on('qrcode', (data) => {
        console.log(data);
        if(wxcode){
            socket.emit('wxcode', wxcode, (data) => {
                show(); 
                console.log(data);
            });
        }else{
            document.getElementById("qrcode").src = data;
            document.getElementById("info").innerHTML = '扫码关注公众号进行身份验证';
            show();
            setTimeout('qrcodeTimeout()', 60 * 1000);
        }
    });
    socket.on('login', (data) => {
        console.log(data);
        userport.userdata = data;
        document.getElementById("qrcode").src = data.headimgurl;
        document.getElementById("info").innerHTML = 'welcome ' + data.nickname;
        show();
        setTimeout('hide()', 2000);
    });
}
userport.close = function () {
    userport.socket.emit('logout', userport.userdata); 
}