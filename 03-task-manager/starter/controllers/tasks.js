const Task = require('../models/Task');
const asyncWrapper = require('../middleware/async');
const {createCustomError} = require('../errors/custom-error');

const getAllTasks = asyncWrapper(async (req, res) => {
    const tasks = await Task.find();
    console.log("get tasks");
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

const getSingleTask = asyncWrapper(async (req, res, next) => {
    const {taskID} = req.params;
    console.log(taskID);
    const singleTask = await Task.findById(taskID);
    // is the same as the above line: const singleTask = await Task.findOne({_id: taskID});
        
    if (!singleTask) {
        throw Error('no task found');
        // return next(createCustomError(`No task with id : ${taskID}`), 404);
    }
        
    return res.status(200).json({ singleTask });
});

const deleteTask = asyncWrapper(async (req, res, next) => {
    const {taskID} = req.params;
    const singleTask = await Task.findByIdAndDelete(taskID);
        
    if (!singleTask) {
        return next(createCustomError(`No task with id : ${taskID}`), 404);
    }

    return res.status(200).json({ msg: "deleted task successfully" });});

const updateTask = asyncWrapper(async (req, res, next) => {
    const {taskID} = req.params;

    const singleTask = await Task.findOneAndUpdate({_id: taskID}, req.body, {
        new: true, // returning a new object instead of the old one
        runValidators: true
    });

    if (!singleTask) {
        return next(createCustomError(`No task with id : ${taskID}`), 404);
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