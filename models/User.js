const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter a name']
    },
    email: {
        type: String,
        required: [true, 'Please enter a email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [5, 'The password should be at least 6 characters long']
    },
    confirmpassword: {
        type: String,
        required: [true, 'Password does not match'],
        minlength: [5, 'The password should be at least 6 characters long']
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    next()
})

userSchema.statics.login = async function (username, password){
    const user = await this.findOne({username});
    if(user){
        const isAuthenticated = await bcrypt.compare(password,user.password);
        if(isAuthenticated){
            return user;
        }else{
            throw Error('Incorrect password');
        }
    }else{
        throw Error('Incorrect email');
    }
}

const User = mongoose.model('user', userSchema);
module.exports = User;