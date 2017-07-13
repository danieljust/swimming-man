const userService = require('../../dao/userService');

module.exports = {
    editorChecker: function (req, res, next) {
        userService.findUserById(req.user.id)
            .then(user => {
                if (user !== null && (user.id == req.params.userId
                        ||user.id==req.query.userId
                    || user.group === 1
                    || user.group === 1337)) {
                    next();
                } else {
                    next(new Error("Access denied"));
                }
            })
            .catch(next);
    }
};
