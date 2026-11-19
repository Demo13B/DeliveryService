const express = require('express');
const bcrypt = require('bcrypt');

const UserModule = require('../modules/users');
const Validator = require('../validators/users');

const router = express.Router();

router.post('/signup', Validator.signupValidator, async (req, res) => {
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const data = {
        email: req.body.email,
        passwordHash,
        name: req.body.name,
        contactPhone: req.body.contactPhone
    }

    try {
        const user = await UserModule.create(data);
        const userData = {
            id: user._id,
            email: user.email,
            name: user.name,
            contactPhone: user.contactPhone
        }
        res.status(201).send({
            data: userData,
            status: 'ok'
        });
    } catch (e) {
        console.error(e);
        let message;

        if (e.errorResponse.code === 11000 && e.errorResponse.keyPattern.email === 1) {
            message = 'email занят'
        } else {
            message = JSON.stringify(e);
        }

        res.status(400).send({
            error: message,
            status: 'error'
        })
    }
});

module.exports = router;