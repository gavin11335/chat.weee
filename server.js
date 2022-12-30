const hostname = '127.0.0.1';
const port = '5000';
const fs = require('fs');
const io = require('socket.io');
const http = require('http');
const { Socket } = require('dgram');
const express = require('express')
const app = express()

app.use(express.static('client'))

app.listen(3000, () => {
    console.log("express are running");
})

var page
fs.readFile('./client.html',function (err,data) {
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

    chatLog = fs.readFileSync('./chatLog.html','utf-8')
    socket.emit('history',chatLog)

    var nickName
    socket.on('nick',function (data) {
        console.log(`名为${data}的用户登陆`);
        nickName = data
    })

    var email
    socket.on('email',function (data) {
        email = data
    })

    socket.on('msg',function (data) {
        var cl = `
<div>
    <img src="https://www.gravatar.com/avatar/${email}?s=35" class="avatar">
    <p class="msg">
        <span class="msgName">${nickName}:</span><br>
        <span class="msgContent">${data}</span>
    </p>
</div> 
`

        socket.emit('serverMsg',cl)
        socket.broadcast.emit('serverMsg',cl)

        fs.appendFile('./chatLog.html',`${cl}`,function (err) {
            if (err) throw err;
            console.log(`聊天记录"${nickName}: ${data}"成功被保存`);
        })
    })
})
