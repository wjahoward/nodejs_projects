const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
} = require('../controllers/userController')
const {authenticateUser, authorizePermissions} = require('../middleware/authentication');

router.route('/').get(authenticateUser, authorizePermissions('admin', 'owner'), getAllUsers);

// order here is important
// need to be before ':id'
// otherwise the 'showMe' will be the 'id'
router.route('/showMe').get(authenticateUser, showCurrentUser);
router.route('/updateUser').patch(updateUser);
router.route('/updateUserPassword').patch(updateUserPassword);

router.route('/:id')
    .get(authenticateUser, getSingleUser);

module.exports = router;