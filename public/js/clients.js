const socket = io();

let userWindow = document.querySelector('.users-window');
let users_list = document.querySelector('#users-list');
let users_count = document.querySelector('.count');
let users = document.querySelector('#people');
let one = document.querySelector('.one');
let two = document.querySelector('.two');
let roomie = document.getElementById('room');
let chats = document.querySelector('.chat');
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-window');
// const userList = document.querySelector('#users');
const roomName = document.querySelector('#roomName');

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


//single room
function userRoom (rooms) {
    roomName.innerHTML = `
        ${rooms.map(room => `<li>${room.name}</li>`).join('')}
    `;

    socket.emit('join', roomName);

}


// get the rooms
socket.on('output-rooms', rooms => {
    let roomsList = document.querySelector('.rooms-list');
    
    users_arr = rooms.name;
    let p = document.createElement('p');
    console.log(p)
    p.innerText = rooms.name;
    // p++;
    roomsList.appendChild(p);

});



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
    const mssg = e.target.elements.msg.value;

        // Emit message to server payload 
        socket.emit('sendMessage', msg => {
            const div = document.createElement('div');
            div.className = 'message outgoing';
            div.innerHTML = `<h5  class="meta">${msg} </h5>
            <p class="text">${mssg}</p>`;
            document.querySelector('.chats').appendChild(div);
        });


    // clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
    }
    
    

});



function outputMessage(result) {
    console.log(result)
    const div = document.createElement('div');
    div.className = 'message incoming';
    div.innerHTML = `<h5  class="meta">${result} </h5>
    <p class="text">${result.text}</p>`;
    document.querySelector('.chats').appendChild(div);
}

// user join
function userJoin(welcome) {
    let div = document.createElement('div');
    div.classList.add('user-join');
    let content = `<p><b id="use">${welcome}</b> joined the chat </p>`;
    div.innerHTML = content;
    document.querySelector('.chats').appendChild(div)
}

// user left
socket.on('user-disconnected', (welcome) => {
    let div = document.createElement('div');
    div.classList.add('user-join');
    let content = `<p><b id="use">${welcome}</b> left the chat</p>`;
    div.innerHTML = content;
    document.querySelector('.chats').appendChild(div)
})