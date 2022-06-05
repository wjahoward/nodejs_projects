const User = require('../models/User');
const Token = require('../models/Token');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser, sendVerificationEmail } = require('../utils');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists');
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  const verificationToken = crypto.randomBytes(40).toString('hex');
  const user = await User.create({ name, email, password, role, verificationToken });

  // const tokenUser = createTokenUser(user);
  // attachCookiesToResponse({ res, user: tokenUser });
  
  const origin = 'http://localhost:3000';
  await sendVerificationEmail({name: user.name, email: user.email, verificationToken: user.verificationToken, origin});
  res
    .status(StatusCodes.CREATED)
    .json(
      { 
        msg: "Success! Please check your email to verify account",
      });
};
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  const isUserVerified = user.isVerified;

  if (!isUserVerified) {
    throw new CustomError.UnauthenticatedError('User has not been verified');
  }

  const tokenUser = createTokenUser(user);
  
  // create refresh token
  let refreshToken = '';

  // check for existing token

  refreshToken = crypto.randomBytes(40).toString('hex');
  const userAgent = req.headers['user-agent'];
  const ip = req.ip;
  const userToken = {refreshToken, ip, userAgent, user: user._id}

  const token = await Token.create(userToken);

  // attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser, token });
};
const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

const verifyEmail = async (req, res) => {
  const {verificationToken, email} = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError(`No user with email ${email} is found`);
  }
  
  const userToken = user.verificationToken;

  if (verificationToken !== userToken) {
    throw new CustomError.UnauthenticatedError(`Tokens do not match`);
  }

  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = '';

  await user.save();

  res.status(StatusCodes.OK).json({
    msg: 'Email verified'}
  );
}

module.exports = {
  register,
  login,
  logout,
  verifyEmail
};
