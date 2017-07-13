module.exports = function (sequelize, DataTypes) {
    return RolePrivilege = sequelize.define("RolePrivilege", {}, {
        timestamps: false,
        freezeTableName: true
    });
};
