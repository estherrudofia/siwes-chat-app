const socket = io();

let userWindow = document.querySelector('.users-window');
let users_list = document.querySelector('#users-list');
let users_count = document.querySelector('.count');
let users = document.querySelector('#people');
let one = document.querySelector('.one');
let two = document.querySelector('.two');
let roomie = document.querySelector('#room');
let chats = document.querySelector('.chat');
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-window');
// const userList = document.querySelector('#users');
const roomName = document.querySelector('#room-name');

socket.on("connect", () => {
    console.log(socket.connected); // true
      show_hide();
  
      one.addEventListener('click', function() {
          users.style.display = 'block';
          roomie.style.display = 'none';    
      });
  
      two.addEventListener('click', function(rooms) {
          roomie.style.display = 'block';
          users.style.display = 'none';
      });
  
  });


  // Join chatroom
// socket.emit('joinRoom', {username, rooms});


// message from server
socket.on('message', message => {
    outputMessage(message);

    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

//welcome message from server
socket.on('welcome', welcome => {
    userJoin(welcome);

    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// socket.on('output-messages', result => {
//         outputMessage(result);

//         // scroll down
//     chatMessages.scrollTop = chatMessages.scrollHeight;
// })
  
function show_hide () {
      if (userWindow.style.display == 'block') {
          userWindow.style.display = 'none';
      } else {
          userWindow.style.display = 'block';
      }
}

// message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (e.target.elements.msg.value === '' ) {
        alert('Type a message');
    } else{
        // Get message text
    const msg = e.target.elements.msg.value;

    const div = document.createElement('div');
    div.className = 'message outgoing';
    div.innerHTML = `<h5  class="meta">${e.username} <span>${e.time}</span> </h5>
    <p class="text">${msg}</p>`;
    document.querySelector('.chats').appendChild(div);

    // clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
    }
    
    // Emit message to server payload 
    socket.emit('chatMessage', msg);
});



function outputMessage(result) {
    console.log(result)
    const div = document.createElement('div');
    div.className = 'message incoming';
    div.innerHTML = `<h5  class="meta">${result.username} <span>${result.time}</span> </h5>
    <p class="text">${result.text}</p>`;
    document.querySelector('.chats').appendChild(div);
}

// user join
function userJoin(welcome) {
    let div = document.createElement('div');
    div.classList.add('user-join');
    let content = `<p><b id="use">${welcome.username}</b> joined the chat <span>${welcome.time}</span></p>`;
    div.innerHTML = content;
    document.querySelector('.chats').appendChild(div)
}

// user left
socket.on('user-disconnected', (welcome) => {
    let div = document.createElement('div');
    div.classList.add('user-join');
    let content = `<p><b id="use">${welcome.id}</b> left the chat</p>`;
    div.innerHTML = content;
    document.querySelector('.chats').appendChild(div)
})