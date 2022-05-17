require('dotenv').config();
require('express-async-errors'); // we can set up our own async await without the need to create try-catch or own middlewares 

// express
const express = require('express');
const app = express();

// products routes
const productsRouter = require('./routes/products');

// connection to mongoDB
const connectDB = require('./db/connect');

// port number
const port = process.env.PORT || 3000;

// custom middlwares
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/not-found');

// general middleware
app.use(express.json());

// routes
app.get('/', (req, res) => {
    res.send('<h1>Hello world!</h1>');
})

// products routes
app.use('/api/v1/products', productsRouter);

// middlewares to deal with errors
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const startConnection = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`port is listening on port ${port}`);
        });
    } catch (err) {
        console.log(err);
    }
};

startConnection();