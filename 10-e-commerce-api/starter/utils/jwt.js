const jwt = require('jsonwebtoken');

const createJWT = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    return token;
};

const isTokenValid = ({token}) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookieToResponse = ({res, user}) => {
    const token = createJWT({payload: user})

    const oneDay = 1000 * 60 * 60 * 24;

    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay)
    });

    res.status(StatusCodes.CREATED).json(user);
};

module.exports = {
    createJWT,
    isTokenValid,
    attachCookieToResponse
};