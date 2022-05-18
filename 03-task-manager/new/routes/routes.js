const express = require('express');
const router = express.Router();

const {getAllTasks, getSpecificTask, postTask} = require('../controller/tasks');

router.route('/').get(getAllTasks).post(postTask);
router.route('/:id').get(getSpecificTask);

module.exports = router;