const jwt = require('jsonwebtoken');

const createJWT = ({payload}) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expresIn: process.env.JWT_EXPRIRES_IN
    });
    return token;
}

const isTokenValid = ({token}) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
    createJWT,
    isTokenValid
};