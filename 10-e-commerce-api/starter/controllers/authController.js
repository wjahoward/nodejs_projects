const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {CustomError, BadRequestError} = require('../errors');

const register = async (req, res) => {
    const {
        name,
        email,
        password
    } = req.body;

    // if any of the inputs are left empty
    if (!name || !email || !password) {
        throw new BadRequestError("Please input name, email and password");
    }

    // verify email unique
    const emailAlreadyExists = await User.findOne({email});

    if (emailAlreadyExists) {
        throw new BadRequestError('Email already exists');
    }

    const user = User.create(req.body);
    return res.status(StatusCodes.CREATED).json(user);

};

const login = async (req, res) => {
    return res.send('login user');
};

const logout = async (req, res) => {
    return res.send('logout user');
};

module.exports = {
    register,
    login,
    logout
};