require('dotenv').config()

const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    return res.send("hi world");
});

// connect to db
const connectDB = require('./db/connect');

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
