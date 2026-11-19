app_port = process.env.APP_PORT || 3000;
mongo_url = process.env.MONGO_URL || 'mongodb://root:pass@mongo:27017/'
session_secret = process.env.SESSION_SECRET || 'default'

module.exports = { app_port, mongo_url, session_secret };