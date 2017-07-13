module.exports = function (sequelize, DataTypes) {
    const Training = sequelize.define('Training', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: {
                    msg: 'Provided string is not a correct date'
                },
                notFuture: function (date) {
                    const nowDate = new Date();
                    const dateFromTraining = new Date(date);
                    if (dateFromTraining > nowDate) {
                        throw new Error('Training date can not be in future');
                    }
                }
            }
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: {
                    msg: "Must be an integer number of pennies"
                },
                greaterThen0: function (value) {
                    if (parseInt(value) < 0) {
                        throw new Error('Duration could not be less then zero');
                    }
                }
            }
        },
        distance: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: {
                    msg: "Must be an integer number of pennies"
                },
                greaterThen0: function (value) {
                    if (parseInt(value) < 0) {
                        throw new Error('Distance could not be less then zero');
                    }
                }
            }
        },
        description: DataTypes.TEXT
    }, {
        timestamps: false
    });
    return Training;
};
