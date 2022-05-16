const express = require('express');
const app = express();
const tasks = require('./routes/tasks');
const connectDB = require('./db/connect');
require('dotenv').config();

// middleware
app.use(express.json());

app.get('/hello', (req, res) => {
    res.send('Task Manager App');
});

app.use('/api/v1/tasks', tasks);

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