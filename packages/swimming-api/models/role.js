module.exports = function (sequelize, DataTypes) {
    const Role = sequelize.define('Role', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        description: {
            type: DataTypes.STRING
        }
    }, {
        classMethods: {
            associate: function (models) {
                Role.hasMany(models.Grant, {foreignKey: 'roleId'});
                Role.belongsToMany(models.User, {through: 'UserRole', foreignKey: 'roleId'});
                Role.belongsToMany(models.Privilege, {through: 'RolePrivilege', foreignKey: 'roleId'});
            }
        },
        timestamps: false
    });
    return Role;
};
