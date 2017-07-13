module.exports = err => {
    if (err.name === "SequelizeUniqueConstraintError") {
        return ([{
            code: 500,
            details: {
                message: 'Sequelize Unique Constraint Error'
            }
        }]);
    }
    if (err.name==="SequelizeValidationError"){
        return ([{
            code: 500,
            details: {
                message: 'Sequelize Unique Constraint Error'
            }
        }]);
    }
    if (err.name==="SequelizeDatabaseError"){
        return ([{
            code: 500,
            details: {
                message: 'Sequelize Database Error'
            }
        }]);
    }
    if (err.name==="TypeError"){
        return ([{
            code: 500,
            details: {
                message: err.message
            }
        }]);
    }
    else {
        return ([{
            code: err.status || 500,
            details: {
                message: err.message
            }
        }]);
    }
};
