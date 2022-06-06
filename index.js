const dotenv = require('dotenv');
const express = require('express');
const app = express(); 
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');

 
const server = require('http').createServer(app);
const mongoose = require('mongoose');
const socketio = require('socket.io')

const { addUser, getUser, removeUser } = require('./util');
const Users = require('./models/User')
const Message = require('./models/Message');
const PORT = process.env.PORT || 5500;
const Room = require('./models/Room'); 


//configure dotenv
dotenv.config();

// Bring in mongodb
require('./database/dbConnection');


// const corsOptions = {
//     origin: 'http://localhost:5500',
//     credentials: true,
//     optionsSuccessStatus: 200 
// }

const io = socketio(server,{
    cors: {
      origin: "http://localhost:5500",
      methods: ["GET", "POST"]
    }
}); 


// app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser()); 
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));



// calling the routes
app.use('/', require('./routes/home'));
// app.use(authRoutes);


// socket.io connection begins
io.on('connection', (socket) => {
    console.log(socket.id);
    Room.find().then(result => {
        socket.emit('output-rooms', result)
    })
    // socket.on('create-room', name => {
    //     const room = new Room({ name });
    //     room.save().then(result => {
    //         io.emit('room-created', result)
    //     })
    // })
    socket.on('join', ({ username, room_id, user_id }) => {
        const { error, user } = addUser({
            socket_id: socket.id,
            username,
            room_id,
            user_id
        })
        socket.join(room_id);
        if (error) {
            console.log('join error', error)
        } else {
            console.log('join user', user)
        }
    })
    socket.on('sendMessage', async (username, message, room_id, callback) => {
        const user = getUser(socket.id);
        names = await Users.find({username})
        const msgToStore = {
            name: names,
            user_id: user,
            room_id,
            text: message
        }
        console.log('message', msgToStore)
        const msg = new Message(msgToStore);
        msg.save().then(result => {
            io.to(room_id).emit('message', result);
            callback()
        })

    })
    socket.on('get-messages-history', room_id => {
        Message.find({ room_id }).then(result => {
            socket.emit('output-messages', result)
        })
    })
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
    })
});

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});