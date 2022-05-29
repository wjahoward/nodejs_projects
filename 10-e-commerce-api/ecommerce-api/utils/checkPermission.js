const CustomErr = require('../errors');

// validate if current user is an admin
// or if the id of the current logged in individual 
// matches with the query id (user)
const checkPermission = (currentUser, param_id) => {
    currentUser = currentUser.user;
    if (currentUser.role === 'admin' ||
        currentUser.userId === param_id.toString()) {
        return;
    }

    throw new CustomErr.UnauthorizedError("Unauthorized to access this route");
};

module.exports = checkPermission;