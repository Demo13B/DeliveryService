const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    name: {
        type: String,
        require: true
    },
    contactPhone: {
        type: String
    }
});

module.exports = model('User', userSchema);