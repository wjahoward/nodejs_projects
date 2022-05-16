const Task = require('../models/Task');
const asyncWrapper = require('../middleware/async');

const getAllTasks = asyncWrapper(async (req, res) => {
    const tasks = await Task.find();
    return res.status(200).json({ tasks });
    // the response can also be set up in this manner,
    // can be flexible:
    /*return res
            .status(200)
            .json({ 
                status: 'success', 
                data: { tasks, noHits: tasks.length }
        });*/
});

const createTask = asyncWrapper(async (req, res) => {
    const task = await Task.create(req.body);
    return res.status(201).json({task});
});

const getSingleTask = asyncWrapper(async (req, res) => {
    const {taskID} = req.params;
    console.log(taskID);
    const singleTask = await Task.findById(taskID);
    // is the same as the above line: const singleTask = await Task.findOne({_id: taskID});
        
    if (!singleTask) {
        return res.status(404).json({ msg: `Task with id ${taskID} not found!`});
    }
        
    return res.status(200).json({ singleTask });
});

const deleteTask = asyncWrapper(async (req, res) => {
    const {taskID} = req.params;
    const singleTask = await Task.findByIdAndDelete(taskID);
        
    if (!singleTask) {
        return res.status(404).json({ msg: `No task with id : ${taskID}`});
    }

    return res.status(200).json({ msg: "deleted task successfully" });});

const updateTask = asyncWrapper(async (req, res) => {
    const {taskID} = req.params;

    const singleTask = await Task.findOneAndUpdate({_id: taskID}, req.body, {
        new: true, // returning a new object instead of the old one
        runValidators: true
    });

    if (!singleTask) {
        return res.status(404).json({ msg: `No task with id : ${taskID}`});
    }

    return res.status(200).json( {msg: `You have updated the task successfully`});
});

module.exports = {
    getAllTasks,
    createTask,
    getSingleTask,
    updateTask,
    deleteTask
};