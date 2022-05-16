const mongoose = require('mongoose');

const connectDB = (url) => {
    return mongoose
    .connect(url, { // to remove depreciation warnings
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    });
}

module.exports = connectDB;