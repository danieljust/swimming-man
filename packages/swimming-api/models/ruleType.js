module.exports = function (sequelize, DataTypes) {
    const RuleType = sequelize.define('RuleType', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        description: {
            unique: {
                msg: 'This rule already in db'
            },
            type: DataTypes.STRING
        }
    }, {
        classMethods: {
            associate: function (models) {
                RuleType.hasMany(models.Privilege, {foreignKey: 'ruleTypeId', onDelete: 'cascade'});
                RuleType.hasMany(models.CreatePrivilege, {foreignKey: 'ruleTypeId', onDelete: 'cascade'});
                RuleType.belongsToMany(models.Position, {through: 'DefaultAction', foreignKey: 'ruleTypeId'});
            }
        },
        timestamps: false
    });
    return RuleType;
};
