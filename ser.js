let app = require('http').createServer(handler)
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
        socket.emit("chat", {sender: "", message: "功能表:<br>1.Who are you?<br>2.九九乘法表" + "<br>3.矩陣表<br>4.猜數字"});
        console.log(JSON.stringify(jsonMessage) + "Login");
        socket.username = jsonMessage.name;
    });

    socket.on('sendchat', function (data) {
        if (socket.token !== 456 && socket.token !== 123 || socket.token === undefined) {

            if (data.message === '矩陣表') {
                socket.emit("chat", {message: "輸入矩陣N"});
                socket.token = 123;
            }

            else if (data.message === "猜數字"){
                socket.emit("chat", {message: "請輸入數字"});
                socket.token = 456;
            }

            else if (data.message === 'Who are you?') {
                socket.emit("chat", {
                    sender: "", message: "==========<br>班級:夜資工一<br>學號" +
                    ":2410632008<br>姓名:黃御哲<br>=========="
                });
                socket.emit("chat", {sender: "", message: "功能表:<br>1.Who are you?<br>2.九九乘法表" + "<br>3.矩陣表<br>4.猜數字"});
            }

            else if (data.message === "九九乘法表") {
                const division = 6;
                let multiplication = [];
                let result = 0;
                for (let i = 1; i <= 9; i++) {
                    for (let j = 1; j <= 9; j++) {
                        result = i * j;
                        if (result == division) {
                            multiplication.push("$");
                        }
                        else multiplication.push(result);
                    }
                    socket.emit("chat", {sender: "", message: multiplication});
                    multiplication = [];
                }
                socket.emit("chat", {sender: "", message: "功能表:<br>1.Who are you?<br>2.九九乘法表" + "<br>3.矩陣表<br>4.猜數字"});
            }

            else {
                socket.emit("chat", {sender: "", message: "功能表:<br>1.Who are you?<br>2.九九乘法表" + "<br>3.矩陣表<br>4.猜數字"});
            }
            console.log("Send here:" + JSON.stringify(data));
        }

        else if (socket.token === 123) {
            if (socket.x === undefined) {
                let string = "N : " + data.message;
                socket.emit('chat', {message: string});
                socket.x = data.message;
                console.log(socket.token);
                socket.emit("chat", {sender: "",message: "輸入整除參數"});
            }

            else if (socket.x !== undefined && socket.y === undefined) {
                let string = "整除數:" + data.message;
                socket.emit('chat', {sender: "",message: string});
                socket.y = data.message;
                console.log(socket.x, socket.y);
                let array = [];
                for (let i = 1; i <= socket.x; i++) {
                    for (let j = 1; j <= socket.x; j++) {
                        if ((i*j) % socket.y == 0) {
                            array.push("@");
                        }
                        else{
                            array.push(i*j);
                        }
                    }
                    socket.emit('chat', {sender: "", message: array});
                    array = [];
                }
                socket.token = "";
                socket.emit("chat", {sender: "", message: "功能表:<br>1.Who are you?<br>2.九九乘法表" + "<br>3.矩陣表<br>4.猜數字"});
            }
        }

        else if (socket.token === 456){
            let answer = 9453;
            if (socket.input === undefined) {
                let tell = "你輸入了:" + data.message;
                socket.input = data.message;
                socket.emit('chat', {sender: "", message: tell});
            }
        }
    });

    socket.on('disconnect', function () {
        let bye = {sender: "SERVER", message: socket.username + "離線了"};
        io.sockets.emit('chat', bye);
    });
});
