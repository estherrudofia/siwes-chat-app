const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
// const uuid = require('node-uuid');
const { Schema } = mongoose;


const user = new Schema({
    // _id: {
    //     type: String,
    //     default: () => uuid.v1,
    //     unique: true
    // },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rooms: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

user.methods.generateAuthToken = async function() {
    try{
        const token = jwt.sign({_id:this._id.toString()}, process.env.ACCESS_TOKEN);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        res.send('The error: ' + error);
    }
}

user.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmpassword = await bcrypt.hash(this.password, 10);
        next();
    } 
})

const Login = mongoose.model('Login', user);

module.exports = Login;