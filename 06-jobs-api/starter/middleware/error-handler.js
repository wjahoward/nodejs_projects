const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  
  let customError = {
    // set default error
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again later"
  };
  
  // by commenting the below codes, it can still be able to display the output
  // if (err instanceof CustomAPIError) { // examples that will pass to here include logging in using invalid credentials
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  if (err.code && err.code == 11000) {
    customError.statusCode = 400;
    customError.msg = `Email: ${err.keyValue.email} has already exist`;
  }

  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
                            .map((item) => item.message)
                            .join(', ');
    customError.statusCode = 400;
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customError.statusCode).json(customError.msg); // make it more generic
}

module.exports = errorHandlerMiddleware
