const auth = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.status(401).send({ error: 'Unauthorised', status: 'error' });
        return;
    }
    next();
}

module.exports = auth;