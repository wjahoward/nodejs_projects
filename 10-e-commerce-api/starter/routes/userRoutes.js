const {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
} = require('../controllers/userController');
const express = require('express');
const router = express.Router();

router.route('/').get(getAllUsers);

router.route('/showMe').get(showCurrentUser);
router.route('/updateUser').post(updateUser);
router.route('/updateUserPassword').post(updateUserPassword);

router.route('/:id')
    .get(getSingleUser);

module.exports = router;