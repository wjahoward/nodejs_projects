require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const tasks = require('./routes/routes');

const connectDB = require('./db/connectDB');

// middleware
app.use(express.json());

app.use('/api/v1/tasks', tasks);

// uses cases of this: id issue
app.use((err, req, res, next) => {
    return res.status(500).json({message: "something went wrong"});
});

// not found
app.use((req, res) => {
    return res.status(404).json({message: 'page not found'});
});

const port = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`server is listening on port ${port}`);
        })
    } catch (err) {
        console.log(err);
    }
};

startServer();