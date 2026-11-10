const User = require('../models/user')

const create = async (data) => {
    const user = new User(data);
    try {
        return user.save();
    } catch (e) {
        throw e;
    }
}

module.exports = { create };