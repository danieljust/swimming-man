const userService = require('../../dao/userService');

module.exports = function (req, res, next) {
    userService.findUserById(req.user.id)
        .then(user => {
            if (user !== null && user.group === 1337) {
                next();
            } else {
                next(new Error("Access denied"));
            }
        })
        .catch(next);
};
