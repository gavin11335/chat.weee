const socket = io.connect('ws://localhost:5000/')
const nickName = document.getElementById('nickText')
const nickButton = document.getElementById('nickButton')
const nickPage = document.getElementById('nickPage')
const main = document.getElementById('main')
const chatLog = document.getElementById('chatLog')
const loadHistory = document.getElementById('loadHistory')

nickButton.onclick = function () {
       if (nickName.value === "") {
        alert("输入框没有内容!")
        return 0;
    }

  socket.emit('nick',nickName.value)
  console.log('用户名已发送');
  nickPage.style.display = 'none'
  main.style.display = 'block'
  loadHistory.style.display = 'block'
}

const inputMsg = document.getElementById('inputMsg')
const msgButton = document.getElementById('msgButton')

msgButton.onclick = function () {
    if (inputMsg.value === "") {
        alert("输入框没有内容!")
        return 0;
    }

    socket.emit('msg',inputMsg.value)
    inputMsg.value = ''
    console.log('消息已发送');
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    msgButton.click();
  }
});

socket.on('history',function (data) {
  loadHistory.onclick = function () {
    chatLog.innerText = data
    loadHistory.style.display = 'none'
    chatLog.style.display = 'block'
  }
})

socket.on('serverMsg',function (...data) {
  chatLog.innerText += data
})

const scrollButton = document.getElementById('scrollButton')
scrollButton.onclick = function () {
    window.scrollTo(0, document.body.scrollHeight);
}

window.onscroll = function() {
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const pageHeight = document.body.scrollHeight;

  if (scrollY + viewportHeight <= pageHeight) {
    scrollButton.style.display = 'block';
  } else {
    scrollButton.style.display = 'none';
  }
}
