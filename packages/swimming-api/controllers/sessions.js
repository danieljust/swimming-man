const jwt = require('jsonwebtoken');

module.exports = {
    generateToken: function (req, res, next) {
        req.token = jwt.sign({
            id: req.user.id,
        }, 'server secret', {
            expiresIn: 60 * 30
        });
        next();
    }
};
