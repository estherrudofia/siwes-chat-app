const mongoose = require('mongoose');
const { Schema } = mongoose;
 
const chatSchema = new Schema({
    username: String,
    msg: {
        type: String,
        required: true
    },
    rooms: {
        type: String,
    }
})


const Message = mongoose.model('Message', chatSchema); 

module.exports = Message;