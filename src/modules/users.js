const User = require('../models/user')

const create = async (data) => {
    const user = new User(data);
    try {
        return user.save();
    } catch (e) {
        console.error(e);
    }
}

const findByEmail = async (email) => {
    const user = User.findOne({ email: email });
    return user;
}

module.exports = { create, findByEmail };