var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
    path: '/myownpath'
});

app.get('/', (req, res) => {
    //res.send('<h1>Hello world</h1>');
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket) => {
    console.log(socket.id);
    socket.on('client', (data, fn) => {
        console.log(data);
        fn('callback a client function');
    });
    socket.emit('server', 'data to client', (data) => {
        console.log(data); 
    });
});


http.listen(3000, () => {
    console.log('listening on *:3000');
});
