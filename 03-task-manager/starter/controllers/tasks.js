const Task = require('../models/Task');

const getAllTasks = (req, res) => {
    return res.send('all items');
};

const createTask = async (req, res) => {
    const task = await Task.create(req.body);
    res.status(201).json({task});
};

const getSingleTask = (req, res) => {
    return res.json({id: req.params.id});
};

const updateTask = (req, res) => {
    return res.send('update task');
};

const deleteTask = (req, res) => {
    return res.send('delete task');
};

module.exports = {
    getAllTasks,
    createTask,
    getSingleTask,
    updateTask,
    deleteTask
};