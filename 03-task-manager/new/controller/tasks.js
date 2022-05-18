const Task = require('../models/Task');

const getAllTasks = async (req, res) => {
    const allTasks = await Task.find();
    return res.status(200).json(allTasks);
};

const getSpecificTask = async (req, res) => {
    const {id} = req.params;
    const task = await Task.findOne({_id: id});

    if (!task) {
        return res.status(404).json({message: `Task with id ${id} is not available`});
    }

    return res.status(200).json({message: 'specific task found'});
};

const postTask = async (req, res) => {
    const task = await Task.create(req.body);
    return res.status(201).json({message: 'Created task successfully'});
};

module.exports = {getAllTasks, getSpecificTask, postTask};