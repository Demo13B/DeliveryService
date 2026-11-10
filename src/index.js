const express = require('express');

const config = require('./config');

app = express();

app.get('/', (req, res) => {
    res.send('Hello, World!\n');
});

const start = async (port) => {
    app.listen(port);
    console.log(`App listening on port: ${port}`)
}

start(config.app_port);