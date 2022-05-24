const CustomErr = require('../errors');
const {isTokenValid} = require('../utils');

const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token;

    if (!token) {
        throw new CustomErr.UnauthenticatedError('Authentication invalid');
    }

    try {
        const payload = isTokenValid(token);
        req.user = {
            name: payload.name,
            userId: payload.userId,
            role: payload.role
        }; // this variable is served as a 'global variable' across other routes once authenticated successfully
     
        next();
    } catch (err) {
        throw new CustomErr.UnauthenticatedError('Authentication invalid');
    }
};

module.exports = {
    authenticateUser
};