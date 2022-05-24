const { StatusCodes } = require("http-status-codes");
const CustomErr = require("../errors");
const User = require("../models/User");
const { createTokenUser, attachCookieToResponse } = require("../utils");

const getAllUsers = async (req, res) => {
    const users = await User.find({role: "user"}).select('-password'); // don't disclose password
    res.status(StatusCodes.OK).json({count: users.length, users: users});
};

const getSingleUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).select('-password  ');
    
    if (!user) {
        throw new CustomErr.NotFoundError(`No user found with id: ${id}`);
    }

    res.status(StatusCodes.OK).json(user);
};

const showCurrentUser = async (req, res) => { // /showMe
    const { user } = req;
    res.status(StatusCodes.OK).json({ user: user });
};       

const updateUser = async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        throw new CustomErr.BadRequestError("Please include name and email");
    }

    const user = await User.findOneAndUpdate({
        _id: req.user.userId,
        name: name,
        email: email, 
        new: true, 
        runValidators: true
    });

    const tokenUser = createTokenUser(user);
    attachCookieToResponse(res, tokenUser);
};

const updateUserPassword = async (req, res) => { // /updateUserPassword
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new CustomErr.BadRequestError("Please input old password and new password");
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
        throw new CustomErr.NotFoundError(`No such user with id ${user.userId}`);
    }

    const isSame = await user.comparePassword(oldPassword);

    if (!isSame) {
        throw new CustomErr.UnauthorizedError("Invalid password");
    }

    user.password = newPassword;

    await user.save(); // this will make use of UserSchema pre 'save' function, which is why the password is hashed upon updating
    res.status(StatusCodes.OK).json({msg: 'Success! Password updated!'});
};

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
};