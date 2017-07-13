const Promise = require("bluebird");
const privilegeService = require('./privilegeService');
const grantService = require('./grantService');
const positionService = require('./positionService');
const filter = require('lodash.filter');
const roleService = require('./roleService');

module.exports = {
    addEntityPrivileges: function (info) {
        return privilegeService.add({
            entityId: info.createdEntity.id,
            privileges: info.createdPrivileges
        });
    },
    addUserDefaultGrants: function (info) {
        return positionService.findByDescription('user')
            .then(position => position.getRuleTypes())
            .then(ruleTypes => {
                const ruleTypesIds = [];
                ruleTypes.map(ruleType => {
                    ruleTypesIds.push(ruleType.id)
                });
                const privileges = filter(info.privileges, function (privilege) {
                    return ruleTypesIds.includes(privilege.ruleTypeId);
                });
                return grantService.add({
                    entityId: info.createdEntity.id,
                    roleId: info.userRole.id,
                    privileges: privileges
                });
            })
    },
    addTrainingDefaultGrants: function (info) {
        return roleService.findRoleByDescription(`user_${info.createdEntity.userId}`)
            .then(role => Promise.props({
                grants: grantService.add({
                    entityId: info.createdEntity.userId,
                    roleId: role.id,
                    privileges: info.privileges
                }),
                createdEntity: info.createdEntity
            }));
    },
    addTrainingGrantsToManager: function (info, manager) {
        return roleService.findRoleByDescription(`manager_${manager}`)
            .then(role => Promise.props({
                grants: grantService.add({
                    entityId: manager,
                    roleId: role.id,
                    privileges: info.privileges
                }),
                createdEntity: info.createdEntity
            }));
    },
    returnEntity: function (info) {
        return new Promise(resolve => {
            resolve(info.createdEntity);
        });
    }
};
