const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Register = require('../model/register'); 
const Login = require('../model/login');

class create {

    static async register (req, res) {
        try{

            
            const body = req.body;

            const password = body.password;
            const confirmpassword = body.confirmpassword;
            
            
            if ( password === confirmpassword) {
                const registerUser = new Register({
                    username: body.username,
                    email: body.email,
                    password: password,
                    confirmpassword: confirmpassword
                });
                
                const token = await registerUser.generateAuthToken();

                const registered = await registerUser.save();
                console.log(registered)
                res.status(201).render('login');
                
            } else {
                res.send('password is not the same');
            }
        } catch(err) {
            res.status(400).send(err);
        }
    }

    static async login (req, res) {
        try{              

                const username = req.body.username;
                const password = req.body.password;

                // if check username and password exist
                if(!username || !password) {
                    return 'please provide username and password';
                }

                // check if user exist and password is correct
                const user = await Register.findOne({username:username}).select('+password');
                

                if(!username || !await user.correctPassword(password, user.password)) {
                    return next('Incorrect email or password', 401)
                }

                    const loginUser = new Login({
                        username: username,
                        password: password,
                        rooms: req.body.rooms
                    });
                    

                    // console.log(loginUser)

                    const token = await loginUser.generateAuthToken();

                    const login = await loginUser.save();
                    res.status(201).render('chat');
                
                
        } catch(err) {
            res.status(400).send('Invalid login details');
        }
    }

    static async logout (req, res) {
        try{
            // req.user.tokens = req.user.tokens.filter((currElement) => {
            //     return currElement.token !== req.token;
            // })

            // res.clearCookies('jwt');
            console.log('logout successfully');

            // await req.user.save();
            res.status(201).render('login');
        } catch(err) {
            res.status(500).send(err);
        }
    }

}


module.exports = create;