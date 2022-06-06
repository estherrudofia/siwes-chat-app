const jwt = require('jsonwebtoken')
const Register = require('../src/model/register');

const auth = async (req, res, next) => {

    try{

        const token = req.cookies.jwt;
        // const verifyUser = jwt.verify(process.env.ACCESS_TOKEN)
        const verifyUser = jwt.verify(token, process.env.ACCESS_TOKEN)

        const user = Register.findOne({_id:verifyUser._id});

        req.token = token;
        req.user = user;

        next();
    } catch (error) {
        res.status(401).send(error);
    }

}

module.exports = auth;
