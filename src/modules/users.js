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

const findById = async (id) => {
    const user = User.findById(id);
    return user;
}

module.exports = { create, findByEmail, findById };