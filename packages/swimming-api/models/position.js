module.exports = function (sequelize, DataTypes) {
    const Position = sequelize.define('Position', {
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
                Position.belongsToMany(models.RuleType, {through: 'DefaultAction', foreignKey: 'positionId'});
            }
        },
        timestamps: false
    });
    return Position;
};
