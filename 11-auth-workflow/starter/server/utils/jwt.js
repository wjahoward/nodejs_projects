const jwt = require('jsonwebtoken');

const createJWT = ({ payload }) => {
  // const token = jwt.sign(payload, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_LIFETIME, // when we have the refreshToken, we do not need to include expiresIn property for the cookie
  // });
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

const isTokenValid = ( token ) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: { user } }); // for access token, set a shorter expiration time
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken }});

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    maxAge: 1000 // 1 second
  });

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + oneDay)
  });
};

// const attachSingleCookieToResponse = ({ res, user }) => {
//   const token = createJWT({ payload: user });

//   const oneDay = 1000 * 60 * 60 * 24;

//   res.cookie('token', token, {
//     httpOnly: true,
//     expires: new Date(Date.now() + oneDay),
//     secure: process.env.NODE_ENV === 'production',
//     signed: true,
//   });
// };

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
