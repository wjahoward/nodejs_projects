const Task = require('../models/Task');

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        return res.status(200).json({ tasks });
    } catch (err) {
        return res.status(500).json({ msg: error });
    }
};

const createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);
        return res.status(201).json({task});
    } catch (err) {
        return res.status(500).json({msg: error});
    }
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