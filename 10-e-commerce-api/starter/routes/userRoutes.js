const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
} = require('../controllers/userController')
const {authenticateUser} = require('../middleware/authentication');

router.route('/').get(authenticateUser, getAllUsers);

// order here is important
// need to be before ':id'
// otherwise the 'showMe' will be the 'id'
router.route('/showMe').get(showCurrentUser);
router.route('/updateUser').patch(updateUser);
router.route('/updateUserPassword').patch(updateUserPassword);

router.route('/:id')
    .get(authenticateUser, getSingleUser);

module.exports = router;