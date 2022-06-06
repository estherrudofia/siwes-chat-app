
const socket = io();


let userWindow = document.querySelector('.users-window');
let users_list = document.querySelector('#users-list');
// console.log(users_list)
let users_count = document.querySelector('.count');
let people = document.querySelector('#people');
let one = document.querySelector('.one');
let two = document.querySelector('.two');
let roomie = document.querySelector('#room');
let chats = document.querySelector('.chat');
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-window');
const userList = document.querySelector('#users');
// console.log(userList)
const roomName = document.querySelector('#room-name');


socket.on("connect", () => {
  console.log(socket.connected); // true
    show_hide();

    one.addEventListener('click', function() {
        people.style.display = 'block';
        roomie.style.display = 'none';    
    });

    two.addEventListener('click', function(rooms) {
        roomie.style.display = 'block';
        people.style.display = 'none';
    
        // const pointer-events = 'none';
        // //Get room and users
        // const room_arr = outputRoomName(rooms);
        // return room_arr;
    });

});


function show_hide () {
    if (userWindow.style.display == 'block') {
        userWindow.style.display = 'none';
    } else {
        userWindow.style.display = 'block';
    }
}


// Get username and room from URL
const { username, rooms } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


// Join chatroom
socket.emit('joinRoom', {username, rooms});


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



console.log(users_list);

socket.on('user-list', (users) => {

    // users_list.innerHTML = `
    //     ${users.map(user => `<li>${user.username}</li>`).join('')}
    // `;

    users_list = document.getElementById('users-list');
    // users_list.innerHTML = "<b>d</b>";
    users_arr = users.username;
    let p = document.createElement('p');
    p.innerText = users.username;
    // p++;
    users_list.appendChild(p);
    
    
    users_count.innerHTML = Object.values(users_arr).length+1;
});




// output message to DOM
function outputMessage(message) {
    if(message.text === '') {
        const div = document.createElement('div');
        div.className = 'message incoming';
        div.innerHTML = `<h5  class="meta">${message.username} <span>${message.time}</span> </h5>
        <p class="text">${message.text}</p>`;
        document.querySelector('.chats').appendChild(div);
    }else {
        const div = document.createElement('div');
        div.className = 'message outgoing';
        div.innerHTML = `<h5  class="meta">${message.username} <span>${message.time}</span> </h5>
        <p class="text">${message.text}</p>`;
        document.querySelector('.chats').appendChild(div);
    }
}

socket.on('user-disconnected', (user) => {
    let div = document.createElement('div');
    div.classList.add('user-join');
    let content = `<p><b id="use">${user.username}</b> left the chat</p>`;
    div.innerHTML = content;
    document.querySelector('.chats').appendChild(div)
})
// function userJoinLeft
function userJoin(welcome) {
    let div = document.createElement('div');
    div.classList.add('user-join');
    let content = `<p><b id="use">${welcome.username}</b> joined the chat <span>${welcome.time}</span></p>`;
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


// one.addEventListener('click', function() {
//     people.style.display = 'block';
//     roomie.style.display = 'none';

// });

