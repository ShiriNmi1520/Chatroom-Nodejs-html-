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
        console.log("Send here:" + data);
        io.sockets.emit('chat', {sender: socket.username, message: data.message});
    });

    socket.on('disconnect', function () {
        var bye = {sender: "SERVER", message: socket.username + "離線了"};
        io.sockets.emit('chat', bye);
    });
});
