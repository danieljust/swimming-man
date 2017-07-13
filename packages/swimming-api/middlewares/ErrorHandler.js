const errorSer = require('../utils/errorSerializer');

module.exports = function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    const newErr = errorSer(err);
    res.status(newErr[0].code).json({errors: newErr});
};
