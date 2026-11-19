const signupValidator = (req, res, next) => {
    if (!req.body)
        return res.status(400).send('No body');

    if (!req.body.email)
        return res.status(400).send('No email');

    if (!req.body.password)
        return res.status(400).send('No password');

    if (!req.body.name)
        return res.status(400).send('No name');

    if (!req.body.contactPhone)
        return res.status(400).send('No contact phone');

    next();
}

module.exports = { signupValidator }