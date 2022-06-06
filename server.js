const dotenv = require('dotenv');
const express = require('express');
const app = express(); 
const cors = require('cors');
const cookieParser = require('cookie-parser');

// const authRoutes = require('./routes/authRoutes');

 
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
io.on('connection', (socket, username) => {
    console.log(socket.id);
    Room.find().then(result => {
        socket.emit('output-rooms', result)
    })

    Users.find({username}).then(data => {
        let name = data.username;
        // let message = data.message;
        console.log(name);

        //Welcome current user   
        socket.emit('welcome',  data.username);

        // Broadcast when a user connects
        socket.broadcast.emit('welcome', data.username);

        // io.emit('user-list', user);
    });



    // listen for chat message
    socket.on('chatMessage', (msg, rooms) => {
        Users.find({username}).then(data => {
            // socket.broadcast.emit('message', msg)
            io.emit('message', data.username, msg);
            const message = new Message({username: data.username, msg, rooms:data.rooms});
            
            message.save().then(() => {
                socket.emit('message', msg, rooms)
            })
        })        
    })

    // Runs when client disconnects
    socket.on('disconnect', (username) => {
        Users.find({username}).then(user => {
            socket.broadcast.emit('user-disconnected', user.username);

            io.emit('user-list', user.username);
        });
        
    })

});

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});