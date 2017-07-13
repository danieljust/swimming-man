module.exports = function (sequelize, DataTypes) {
    return UserRole = sequelize.define("UserRole", {}, {
        timestamps: false,
        freezeTableName: true
    });
};
