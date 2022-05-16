const express = require('express');
const router = express.Router();

const {getAllTasks, createTask, getSingleTask,
    updateTask, deleteTask} = require('../controllers/tasks');

router.route('/').get(getAllTasks).post(createTask);
router.route('/:taskID').get(getSingleTask).patch(updateTask).delete(deleteTask);

module.exports = router;