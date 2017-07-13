const passport = require('passport');
const Strategy = require('passport-local');
const userService = require('../dao/userService');
const verify = require('../utils/salting').verifyPassword;

passport.use(new Strategy(
    function (username, password, done) {
        userService.findUserByEmail(username).then(user => {
                if (user !== null) {
                    verify(password, user.password)
                        .then((equal) => {
                            if (equal) {
                                done(null, user);
                            } else {
                                done(null, false);
                            }
                        }).catch();
                }
                else {
                    done(null, false);
                }
            }
        ).catch();
    }
));

module.exports = passport;
