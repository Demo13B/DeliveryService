const session = require('express-session');

const config = require('../config');

const newSession = session({
    secret: config.session_secret,
    resave: false,
    saveUninitialized: false
});

module.exports = newSession;