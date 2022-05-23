require('dotenv').config()
require('express-async-errors');

const express = require('express');
const app = express();

// rest of the packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// connect to db
const connectDB = require('./db/connect');

// routers
const authRouter = require('./routes/authRoutes');

// middlewares
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddlware = require('./middleware/error-handler');

app.use(morgan('tiny')); // allows one to knoow which routes have been accessed
app.use(express.json());
app.use(cookieParser()); // access the cookie

app.get('/', (req, res) => {
    return res.send("hi world");
});

app.use('/api/v1/auth', authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddlware);

const port = process.env.PORT || 3000;

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
