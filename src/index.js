const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const config = require('./config');
const passport = require('./passport');
const UserRouter = require('./routers/users');

app = express();
app.use(session({
    secret: config.session_secret,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use('/api', UserRouter);

app.get('/', (req, res) => {
    res.send('Hello, World!\n');
});

const start = async (port, mongo_url) => {
    await mongoose.connect(mongo_url);
    console.log('Mongo connected');
    app.listen(port);
    console.log(`App listening on port: ${port}`);
}

start(config.app_port, config.mongo_url);