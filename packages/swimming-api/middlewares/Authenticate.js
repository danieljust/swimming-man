const passport = require('./Passport');

module.exports = passport.authenticate(
        'local', {
            session: false
        });
