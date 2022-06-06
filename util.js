const UsersDetail = require('./models/User');
const Rooms = require('./models/Room');

const users = [];

const addUser = ({ socket_id, username, user_id, room_id }) => {
    const exist = UsersDetail.find({username}) && Rooms.find({room_id}); 
    // const exist = users.find(user => user.room_id === room_id && user.user_id === user_id);
    if (exist) {
        return { error: 'User already exist in this room' }
    }
    const user = { socket_id, username, user_id, room_id };
    users.push(user)
    console.log('users list', users)
    return { user }
}

const removeUser = (socket_id) => {
    const index = users.findIndex(user => user.socket_id === socket_id);
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}
const getUser = (socket_id) => users.find(user => user.socket_id === socket_id);

module.exports = { addUser, removeUser, getUser };
