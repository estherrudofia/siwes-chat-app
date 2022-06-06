

const socket = io();

socket.on("connect", () => {
  console.log(socket.connected); // true
});



let userWindow = document.querySelector('.users-window');
let users_list = document.querySelector('.users-list');
let users_count = document.querySelector('.count');
let people = document.querySelector('#people');
let one = document.querySelector('.one');
let two = document.querySelector('.two');
let roomie = document.querySelector('#room');
let chats = document.querySelector('.chat');

const show_hide = () => {
    if (userWindow.style.display == 'block') {
        userWindow.style.display = 'none';
    } else {
        userWindow.style.display = 'block';
    }
}





const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-window');
const userList = document.querySelector('.users');
const roomName = document.querySelector('#room-name');

// Get username and room from URL
const { username, rooms } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


// Join chatroom
socket.emit('joinRoom', {username, rooms});

// //Get room and users
// socket.on('roomusers', ({rooms, users}) => {
//     outputRoomName(rooms);
//     outputUsers(users);
// })

// message from server
socket.on('message', message => {
    outputMessage(message);

    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

//welcome message from server
socket.on('welcome', welcome => {
    userJoinLeft(welcome);

    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;

    // Emit message to server payload 
    socket.emit('chatMessage', msg);

    // clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


socket.on('user-list', (users) => {
    users_list.innerHTML = "";
    users_arr = Object.values(users);
    for(i=0; i<users_arr.length; i++) {
        let p = document.createElement('p');
        p.innerText = users_arr[i];
        users_list.appendChild(p);
    }
    users_count.innerHTML = users_arr.length;
});



// output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.className = 'message outgoing';
    div.innerHTML = `<h5  class="meta">${message.username} <span>${message.time}</span> </h5>
    <p class="text">${message.text}</p>`;
    document.querySelector('.chats').appendChild(div);
}

// function userJoinLeft
function userJoinLeft(welcome) {
    let div = document.createElement('div');
    div.classList.add('user-join');
    let content = `<p><b id="use">${welcome.username}</b> <span>${welcome.time}</span> <br> joined the chat</p>`;
    div.innerHTML = content;
    document.querySelector('.chats').appendChild(div)
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}


// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}


one.addEventListener('click', function() {
    people.style.display = 'block';
    roomie.style.display = 'none';

    //     //Get room and users
    // socket.on('roomusers', ({users}) => {
    //     outputUsers(users);
    // })

});

two.addEventListener('click', function(rooms) {
    roomie.style.display = 'block';
    people.style.display = 'none';

    // const pointer-events = 'none';
    // //Get room and users
    // const room_arr = outputRoomName(rooms);
    // return room_arr;
})