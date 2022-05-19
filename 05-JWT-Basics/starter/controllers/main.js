// check username, password in post(login) request
// if exist, create new JWT
// send back to front-end

// setup authentication so only the request with JWT 
// can access the dashboard

const jwt = require('jsonwebtoken');
const CustomAPIError = require('../errors/custom-error');

const login = async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        throw new CustomAPIError('Please provide email and password', 400);
    }

    // just for demo, normally provided by DB
    const id = new Date().getDate();

    // try to keep payload small, better experience for user
    // just for demo, in production use long, complex and unguessable string value
    const token = jwt.sign({id, username}, process.env.JWT_SECRET, {expiresIn: '30d'}); // do not put confidential information inside i.e. password  

    res.status(200).json({msg: 'user created', token});
};

const dashboard = async (req, res) => {
    const luckyNumber = Math.floor(Math.random() * 100);
    res.status(200).json({msg: `Hello, ${decoded.username}`, secret: `Here is your authorize data, your lucky number is ${luckyNumber}`});
}

module.exports = {
    login,
    dashboard
};