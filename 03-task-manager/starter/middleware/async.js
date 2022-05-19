/*
    intead of writing async await for all codes,
    we create a wrapper instead
*/

const asyncWrapper = (fn) => {
    return async (req, res, next) => {
        try {
            console.log("async wrapper");
            await fn(req, res, next);
        } catch (error) {
            console.log("test error");
            next(error);
        }
    };
};

module.exports = asyncWrapper;