const hostname = '127.0.0.1';
const port = '5000';
const fs = require('fs');
const io = require('socket.io');
const http = require('http');
const { Socket } = require('dgram');

var chatLog
setInterval(() => {
    fs.readFile('./chatLog.txt','utf8',function (err,data) {
        if (err) {
            console.log(err);
            return;
        }

        chatLog = data
    })
}, 1000);

var page
fs.readFile('./chat.html',function (err,data) {
    if (err) {
        console.log(err);
        return
    }

    page = data
})

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(page); 
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

const ws = io.listen(server)

var chatLog
ws.on('connection',function (socket) {
    console.log('有一个客户端已连接');
 
    socket.emit('serverMsg',chatLog)

    var nickName
    socket.on('nick',function (data) {
        console.log(`名为${data}的用户登陆`);
        nickName = data 
    })
    
    var msg
    socket.on('msg',function (data) {
        var cl = `\n${nickName}说：${data}`
        console.log(cl);
        msg = data

        socket.emit('serverMsg',cl)
        socket.broadcast.emit('serverMsg',cl)
         
        fs.appendFile('./chatLog.txt',`${cl}`,function (err) {
            if (err) throw err;
            console.log(`聊天记录"${cl}"成功被保存`);
        })
    })
})
