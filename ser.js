var app = require('http').createServer(handler)
    , io = require('socket.io').listen(app)
    , fs = require('fs');
app.listen(8124, "0.0.0.0");

function handler(req, res) {
    fs.readFile('chat.html', function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading chat.html');
        }
        console.log("server started\n return http 200");
        res.writeHead(200);
        res.end(data);
    });
}

io.sockets.on('connection', function (socket) {
    socket.on('addme', function (jsonMessage) {
        console.log(JSON.stringify(jsonMessage) + "Login");
        socket.username = jsonMessage.name;
        var toClient = {sender: "SERVER", message: "歡迎" + jsonMessage.name};
        socket.emit('chat', toClient);
        toClient.message = jsonMessage.name + "正在上線";
        socket.broadcast.emit('chat', toClient);
    });
    socket.on('sendchat', function (data) {
        if (data.message === '1') {
            socket.emit('chat', {sender: 'Greeting', message: '安安吃飽ㄇ'});
        } else if (data.message === '2') {
            socket.emit('chat', {sender: 'Greeting', message: '晚安'});
        } else if (data.message === '99') {
            console.log(data.ignore)
            const one = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            let test = [];
            let i = [];
            var result;
            for (const obj of one) {
                for (const obj2 of one) {
                    result = obj * obj2;
                    if (result == data.ignore){
                        test.push(" ");
                    }
                    else{
                        test.push(result);
                    }
                }
                i.push(test);
                test = [];
            }
            socket.emit('chat', {sender: '9x9', message: i.join('<br>')});
        } else if (data.message === 'profile') {
            socket.emit('chat', {sender: 'class', message: '夜資工一<br>'});
            socket.emit('chat', {sender: 'name', message: '2410632008 黃御哲<br>'});
        } else if (data.message === 'clear') {
            for (i = 0; i <= 20; i++) {
                socket.emit('chat', {sender: '', message: '<br>'});
            }
        }
        console.log("Send here:" + data);
        io.sockets.emit('chat', {sender: socket.username, message: data.message});
    });

    socket.on('disconnect', function () {
        var bye = {sender: "SERVER", message: socket.username + "離線了"};
        io.sockets.emit('chat', bye);
    });
});
