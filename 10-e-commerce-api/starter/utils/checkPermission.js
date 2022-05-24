const CustomErr = require('../errors');

const checkPermission = (user, param_id) => {
    if (user.role === 'admin' ||
        user._id.toString() === param_id) {
        return;
    }

    return CustomErr.UnauthorizedError("Unauthorized to access this route");
};

module.exports = checkPermission;