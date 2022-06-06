const dotenv = require('dotenv');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const formatMessage = require('./utils/format');
const moment = require('moment')
const Message = require('./src/model/user');
// const loginDetails = require('./src/services/register');
// const {} = require('./src/model/login');
const Login = require('./src/model/login');



//configure dotenv
dotenv.config();

// Bring in mongodb
require('./src/database/dbConnection');



// Socket ============
const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
});


//Run the client connects
io.on('connection', (socket) => {

    // app.use('/api/login', (req, res) => {
    //     let user_id = req.Login.username;
    //     console.log(user_id);
    // })
    // console.log(Login.username)
    // Message.find().then( result => {
    //     socket.emit('output-messages', result)
    // })

        Login.findOne().then(data => {
            let name = data.username;
            // let message = data.message;
            console.log(name);

            //Welcome current user   
            socket.emit('welcome', formatMessage( data.username));

            // Broadcast when a user connects
            socket.broadcast.emit('welcome', formatMessage( data.username));

            // io.emit('user-list', user);
        });
    
    

    // listen for chat message
    socket.on('chatMessage', (msg, rooms) => {
        Login.findOne().then(data => {
            // socket.broadcast.emit('message', msg)
            io.emit('message', formatMessage( data.username, msg));
            const message = new Message({username: data.username, msg, rooms:data.rooms});
            
            // message.save().then(() => {
            //     socket.emit('message', msg, rooms)
            // })
        })        
    })

    // Runs when client disconnects
    socket.on('disconnect', () => {
        Login.findOne().then(user => {
            socket.broadcast.emit('user-disconnected', user.username);

            io.emit('user-list', user.username);
        });
        
    })

});


// end Socket ==================





//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));


// calling the routes

app.use('/', require('./src/routes/home'));

const PORT = process.env.PORT || 4500;

// app.listen('4400', () => console.log(`App is running on port: 4400`));
server.listen(PORT, () => {console.log(`Socket is running on port: ${PORT}`);});