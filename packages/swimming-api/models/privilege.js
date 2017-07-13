module.exports = function (sequelize, DataTypes) {
    const Privilege = sequelize.define('Privilege', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        entityId: {
            type: DataTypes.UUID
        }
    }, {
        classMethods: {
            associate: function (models) {
                Privilege.hasMany(models.Grant, {foreignKey: 'privilegeId', onDelete: 'cascade'});
                Privilege.belongsToMany(models.Role, {through: 'RolePrivilege', foreignKey: 'privilegeId'});
                Privilege.belongsTo(models.RuleType, {foreignKey: 'ruleTypeId'});
            }
        },
        timestamps: false
    });
    return Privilege;
};
