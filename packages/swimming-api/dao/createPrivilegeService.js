const models = require('../models');

module.exports = {
    add: function (createPrivilege) {
        return models.CreatePrivilege.create(createPrivilege);
    },
    getCreatePrivilege: function (createPrivilege) {
        return models.CreatePrivilege.findOne({
            where: {
                ruleTypeId: createPrivilege.ruleTypeId,
                entityType: createPrivilege.entityType
            }
        });
    },
    getCreatePrivilegesByEntityType: function (entityType) {
        return models.CreatePrivilege.findAll({
            where: {
                entityType: entityType
            },
            attributes: ['ruleTypeId']
        });
    },
    destroy: function (createPrivilege) {
        return models.CreatePrivilege.destroy({
            where: {
                ruleTypeId: createPrivilege.ruleTypeId,
                entityType: createPrivilege.entityType
            }
        });
    },
    destroyAll: function () {
        return models.CreatePrivilege.destroy({
            where: {}
        });
    }
};
