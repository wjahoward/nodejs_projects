const jwt = require('jsonwebtoken');

const createJWT = (payload) => {
    console.log(payload);
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
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