app_port = process.env.APP_PORT || 3000;
mongo_url = process.env.MONGO_URL || 'mongodb://root:pass@mongo:27017/'

module.exports = { app_port, mongo_url };