// when there is an error along the way, the error 
// will be automatically passed to the middleware 
// (need to create manually). Then, need to return back
// the json data i.e. error-handler.js
require('express-async-errors'); 
const express = require('express');
const app = express();
const tasks = require('./routes/tasks');
const connectDB = require('./db/connect');
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

require('dotenv').config();

// middleware
app.use(express.json());

app.get('/hello', (req, res) => {
    res.send('Task Manager App');
});

app.use('/api/v1/tasks', tasks);

app.use(notFound);
app.use(errorHandlerMiddleware); // this is still required to have the next() after passing the erorr message 

const port = 3000;

const start = async () => { // making sure can connect to db first before starting up server
    try {
        await connectDB(process.env.MONGO_URI); // keeping secret
        app.listen(port, console.log(`Server is listening on port ${port}...`));
    } catch (err) {
        console.log(error);
    }
};

start();