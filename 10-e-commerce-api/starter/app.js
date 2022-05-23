require('dotenv').config()
require('express-async-errors');

const express = require('express');
const app = express();

// rest of the packages
const morgan = require('morgan');

// errors
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddlware = require('./middleware/error-handler');

const port = process.env.PORT || 3000;

// connect to db
const connectDB = require('./db/connect');

app.use(morgan('tiny')); // allows one to knoow which routes have been accessed
app.use(express.json());

app.get('/', (req, res) => {
    return res.send("hi world");
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddlware);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`app is listening on port number ${port}`);
        });
    } catch (err) {
        console.log(err);
    }
};

start();
