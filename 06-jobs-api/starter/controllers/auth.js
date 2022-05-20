const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, UnauthenticatedError} = require('../errors'); // this is referring to index.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    const {name, email, password} = req.body;

    // NOTE: OPTIONAL
    // this is the more meaningful way of sending validating responses
    // as mongoose validator response can be too lengthy
    if (!name || !email || !password) {
        throw new BadRequestError('Please provide name, email and password');
    }

    // the below codes are depended on the setup that have been
    // created on the front end. Can send back only the token
    // There are setups where the front end decodes the token
    // instead, instead of sending a name and userId (to decode the code)
    const user = await User.create(req.body);
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ 
        user: { name: user.name },
        token });
};
   
const login = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }

    const user = await User.findOne({email});

    // compare password
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials');
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user: {name: user.name }, token});
};

module.exports = {
    register,
    login
};