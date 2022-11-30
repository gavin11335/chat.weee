const { Socket } = require('dgram');
const fs = require('fs');
const { connect } = require('http2');
const http = require('node:http');
const hostname = '0.0.0.0';
const port = 5000;
const io = require('socket.io')
var page
var html

//读取发送给客户端的html页面
fs.readFile('./chat.html',function (err,pagee) {
    if (err) {
        console.log(err);
    }

    page = pagee
    console.log('读取html成功');
})

//读取chatRecord.json并把数据转化成js数组
var chatRecord = fs.readFileSync('./chatRecord.json','utf-8')
var crr = JSON.parse(chatRecord)

//遍历crr中的内容并生成消息html
for (const item of crr) {
    html = '' + `
    <div class="msg">
        <p class="name">${item.name}</p>
        <p class="message">${item.msg}</p>
        <p class="date">${item.date}</p>
    </div>
    `
}

//创建服务器
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(page);
  });

//监听
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const ws = io.listen(server)

ws.on('connection',function (socket) {
    console.log('有一个客户端已经连接');
    socket.emit('cr',html)

    var hhtml
    socket.on('msg',function (...data) {       
        console.log(data);
        
        //遍历客户端发送回来的数据，并转换成消息html
        for (const item of data) {
            hhtml = '' + `
        <div class="msg">
            <p class="name">${item.name}</p>
            <p class="message">${item.msg}</p>
            <p class="date">${item.date}</p>
        </div>
        `
        }
        
        //将转化好的html发送给客户端
        socket.emit('cr',hhtml)
        socket.broadcast.emit('cr',hhtml)
     })

})