const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const UserModule = require('./modules/users');

const verify = async (email, password, done) => {
    let user;
    try {
        user = await UserModule.findByEmail(email);
    } catch (e) {
        return done(e);
    }

    if (!user)
        return done(null, false);

    if (!(await bcrypt.compare(password, user.passwordHash)))
        return done(null, false);

    return done(null, user);
}

const options = {
    usernameField: 'email',
    passwordField: 'password'
}

passport.use('local', new LocalStrategy(options, verify));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModule.findById(id);
        done(null, user);
    } catch (e) {
        done(e);
    }
})

module.exports = passport;