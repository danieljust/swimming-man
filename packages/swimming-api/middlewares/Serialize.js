const userService = require('../dao/userService');

module.exports = function (req, res, next) {
    userService.getUserPositions(req.user.id)
        .then(positions => {
            req.user = {
                id: req.user.id,
                username: req.user.firstName + ' ' + req.user.lastName,
                positions: positions
            };
            next();
        })
        .catch(next);
};
