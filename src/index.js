const express = require('express');
const mongoose = require('mongoose');
const http = require('http');

const config = require('./config');
const passport = require('./passport');
const session = require('./middleware/session');
const UserRouter = require('./routers/users');
const AdvertisementRouter = require('./routers/advetisements');
const createSocket = require('./socket');

app = express();
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use('/api/advertisements', AdvertisementRouter);
app.use('/api', UserRouter);

app.get('/', (req, res) => {
    res.send('Hello, World!\n');
});

const start = async (port, mongo_url) => {
    await mongoose.connect(mongo_url);
    console.log('Mongo connected');
    const server = http.createServer(app);
    createSocket(server);
    server.listen(port);
    console.log(`App listening on port: ${port}`);
}

start(config.app_port, config.mongo_url);