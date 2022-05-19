const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError} = require('../errors');
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

    const user = await User.create(tempUser);
    const token = jwt.sign({userId: user._id, name: user.name}, 'jwtSecret', {
        expiresIn: '30d',
    });
    res.status(StatusCodes.CREATED).json({ token });
};

const login = async (req, res) => {
    res.send('login user');
};

module.exports = {
    register,
    login
};