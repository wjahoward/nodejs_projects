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

const updateUserPassword = async (req, res) => {
    res.send("update user password");
};

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
};