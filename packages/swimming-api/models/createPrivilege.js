module.exports = function (sequelize, DataTypes) {
    return CreatePrivilege = sequelize.define('CreatePrivilege', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            entityType: {
                type: DataTypes.STRING
            },
            ruleTypeId: {
                type: DataTypes.UUID
            }
        },{
            timestamps: false
        }
    );
};
