require('dotenv').config();

const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, UnauthenticatedError} = require('../errors');
const {attachCookieToResponse} = require("../utils");

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

    // first registered user is an admin
    const isFirstAccount = await User.countDocuments() === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    const user = User.create({name, email, password, role});

    const tokenUser = {
        name: user.name, 
        userId: user._id,
        role: user.role
    };

    attachCookieToResponse(res, tokenUser);

};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError("Please include your email and password");
    }

    const user = await User.findOne({ email });
    const isSame = await user.comparePassword(password);

    if (password && !isSame) {
        throw new UnauthenticatedError("Invalid password");
    }

    if (!user) {
        throw new UnauthenticatedError("Invalid credentials");
    }

    const tokenUser = {
        name: user.name,
        userId: user._id,
        role: user.role
    };

    attachCookieToResponse(res, tokenUser);
};

const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 5 * 1000) // set expiration of cookie 5 seconds before finally disappear
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged out'});
};

module.exports = {
    register,
    login,
    logout
};