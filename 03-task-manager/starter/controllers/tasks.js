const Task = require('../models/Task');

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        return res.status(200).json({ tasks });
    } catch (err) {
        return res.status(500).json({ msg: err });
    }
};

const createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);
        return res.status(201).json({task});
    } catch (err) {
        return res.status(500).json({msg: err});
    }
};

const getSingleTask = async (req, res) => {
    try {
        const taskID = req.params.id;
        const singleTask = await Task.findById(taskID);
        // is the same as the above line: const singleTask = await Task.findOne({_id: taskID});
        
        if (!singleTask) {
            return res.status(404).json({ msg: `Task with id ${taskID} not found!`});
        }
        
        return res.status(200).json({ singleTask });
    } catch (err) {
        return res.status(500).json({msg: err});
    }
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