const { StatusCodes } = require("http-status-codes");
const CustomErr = require("../errors");
const User = require("../models/User");

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
    res.send("update user");
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

    if (!user.comparePassword(oldPassword)) {
        throw new CustomErr.UnauthorizedError("Invalid password");
    }

    user.password = newPassword;

    await user.save();
    res.status(StatusCodes.OK).json({msg: 'Success! Password updated!'});
};

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
};