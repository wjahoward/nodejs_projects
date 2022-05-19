const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {BadRequest, BadRequestError} = require('../errors');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    const {name, email, password} = req.body;

    // NOTE: OPTIONAL
    // this is the more meaningful way of sending validating responses
    // as mongoose validator response can be too lengthy
    if (!name || !email || !password) {
        throw new BadRequestError('Please provide name, email and password');
    }

    const salt = await bcrypt.genSalt(10); // generate 10 random bytes. the bigger the number, the more random
    const hashedPassword = await bcrypt.hash(password, salt);

    const tempUser = {name, email, password: hashedPassword};

    const user = await User.create(tempUser);
    res.status(StatusCodes.CREATED).json(user);
};

const login = async (req, res) => {
    res.send('login user');
};

module.exports = {
    register,
    login
};