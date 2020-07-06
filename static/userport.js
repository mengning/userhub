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
    var hideobj = document.getElementById("hidebg");
    hidebg.style.display = "block";  //显示隐藏层
    hidebg.style.height = document.body.clientHeight + "px";  //设置隐藏层的高度为当前页面高度
    document.getElementById("hidebox").style.display = "block";  //显示弹出层
}
function hide()  //去除隐藏层和弹出层
{
    document.getElementById("hidebg").style.display = "none";
    document.getElementById("hidebox").style.display = "none";
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
function userport(url, username) {

    var browser = whatBrowser();
    var wxcode = null;
    if(browser == "weixin"){
        //获取微信code
        wxcode = getQueryString('code');
        if(wxcode == null){
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx21d8c47fbc68af9d&redirect_uri=http%3A%2F%2Fapiacb.natappfree.cc&response_type=code&scope=snsapi_base&state=123#wechat_redirect'; 
        }
    }
    document.getElementById("browser").innerHTML = browser;

    const socket = io(url, {
        path: '/'+username,
        transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
        console.log(socket.id); // 'G5p5...'
    });
    socket.on('server', (data, fn) => {
        console.log(data);
        if(wxcode){
            socket.emit('wxcode', wxcode, (data) => {
                show(); 
                console.log(data);
            });
        } 
        document.getElementById("qrcode").src = data;
        show();
        setTimeout('qrcodeTimeout()', 60 * 1000);
        fn('callback a server function');
    });
    socket.on('userverify', (data, fn) => {
        console.log(data);
        document.getElementById("qrcode").src = data.headimgurl;
        document.getElementById("info").innerHTML = 'welcome ' + data.nickname;
        setTimeout('hide()', 2000);
        fn('callback userverify');
    });
}
