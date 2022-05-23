const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    return res.send("hi world");
});

const start = async () => {
    try {
        await app.listen(port, () => {
            console.log(`app is listening on port number ${port}`);
        });
    } catch (err) {
        console.log(err);
    }
};

start();
