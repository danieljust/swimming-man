module.exports = function (sequelize, DataTypes) {
    return DefaultAction = sequelize.define("DefaultAction", {}, {
        timestamps: false,
        freezeTableName: true
    });
};
