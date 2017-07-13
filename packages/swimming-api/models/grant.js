module.exports = function (sequelize, DataTypes) {
    return Grant = sequelize.define('Grant', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        }
    }, {
        timestamps: false
    });
};
