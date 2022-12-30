const socket = io.connect('ws://localhost:5000/')
const nickName = document.getElementById('nickText')
const goButton = document.getElementById('goButton')
const firstPage = document.getElementById('firstPage')
const main = document.getElementById('main')
const chatLog = document.getElementById('chatLog')
const loadHistory = document.getElementById('loadHistory')
const head = document.getElementById('head')
const email = document.getElementById('emailText')

goButton.onclick = function () {

  if (nickName.value === '') {
    alert("没有输入Nickname!")
    return 0;
  }

  var hash = md5(email.value.toLowerCase())
  socket.emit('nick',nickName.value)
  socket.emit('email',hash)
  firstPage.style.display = 'none'
  main.style.display = 'block'
  loadHistory.style.display = 'block'
  head.style.display = 'block'
}

const inputMsg = document.getElementById('inputMsg')
const msgButton = document.getElementById('msgButton')

function autolink(input) {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return input.replace(urlRegex, function(url) {
    return '<a href="' + url + '">' + url + '</a>'
  }) 
}

msgButton.onclick = function () {
    if (inputMsg.value === "") {
        alert("输入框没有内容!")
        return 0;
    }

    var msg = autolink(inputMsg.value)
    socket.emit('msg',msg)
    inputMsg.value = ''
    console.log('消息已发送');
    chatLog.style.display = 'block'
    loadHistory.style.display = 'none'
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    msgButton.click();
  }
});

socket.on('history',function (data) {
  loadHistory.onclick = function () {
    chatLog.innerHTML = data
    loadHistory.style.display = 'none'
    chatLog.style.display = 'block'
  }
})

socket.on('serverMsg',function (...data) {
  chatLog.innerHTML += data
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