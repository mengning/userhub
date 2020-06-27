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
function qrcodeTimeout(){
    document.getElementById("info").innerHTML = 
    '<p onclick="window.location.reload()">二维码超时，请刷新页面重试！</p>';
}
function userport(url){
    const socket = io(url, {
        path: '/userhub',
        transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
        console.log(socket.id); // 'G5p5...'
    });
    socket.on('server', (data, fn) => {
        console.log(data);
        document.getElementById("qrcode").src = data;
        show();
        setTimeout('qrcodeTimeout()', 60*1000);
        fn('callback a server function');
    });
    socket.on('userverify', (data, fn) => {
        console.log(data);
        document.getElementById("qrcode").src = data.headimgurl;
        document.getElementById("info").innerHTML = 'welcome ' + data.nickname;
        setTimeout('hide()', 2000);
        fn('callback userverify');
    });

    socket.emit('client', 'data to server', (data) => {
        console.log(data); 
    });
}
