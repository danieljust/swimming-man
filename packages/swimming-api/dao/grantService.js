const models = require('../models');
const roleService = require('./roleService');
const privilegeService = require('./privilegeService');
const P = require("bluebird");

function add(data) {
    const userId = data.entityId;
    const roleId = data.roleId;
    const privilegesBulk = data.privileges;
    const grants = [];
    privilegesBulk.map(privilege => {
        grants.push({
            userId: userId,
            roleId: roleId,
            privilegeId: privilege.id
        });
    });
    return models.Grant.bulkCreate(grants);
}

function getUserIdByPrivilegeId (privilegeId) {
    return models.Grant.findAll({
        where:{
            privilegeId: privilegeId
        }
    })
}

module.exports = {
    add: add,
    findGrant: function (grant) {
        return models.Grant.findOne({
            where: {
                userId: grant.userId,
                privilegeId: grant.privilegeId
            }
        });
    },
    getUserGrantsByUserId: function (userId) {
        return models.Grant.findAll({
            where: {
                userId: userId
            },
            attributes: ['privilegeId']
        });
    },
    destroy: function (grant) {
        return models.Grant.destroy({
            where: {
                userId: grant.userId,
                privilegeId: grant.privilegeId
            }
        });
    },
    destroyAll: function () {
        return models.Grant.destroy({
            where: {}
        });
    },
    destroyByPrivilegeIdsAndUserId: function (ids, userId) {
        return models.Grant.findAll({
            where: {
                privilegeId: {
                    $in: ids
                },
                userId: userId
            },
            limit: 1
        })
            .then(result => {
                return models.Grant.destroy({
                    where: {
                        id: {
                            $in: result
                        }
                    },
                    force: true
                });
            });
    },
    destroyByUserRolePrivilegeIds: function (userId, roleId, privilegesIds) {
        return models.Grant.destroy({
            where: {
                privilegeId: {
                    $in: privilegesIds
                },
                userId: userId,
                roleId: roleId
            }
        });
    },
    addPrivilegesToRoleAndGrantThem: function (privilegeArray, roleDesc) {
        return roleService.findRoleByDescription(roleDesc)
            .then(roles => {
                const rolesWithoutGrants = [];
                roles.map(role => {
                    rolesWithoutGrants.push(P.all([
                            role.getUsers(),
                            role,
                            role.addPrivileges(privilegeArray)
                        ])
                    )
                });
                return P.all(rolesWithoutGrants);
            })
            .then(info => {
                if (info[0].length !== 0) {
                    let newGrantsForUsers = [];
                    info[0].map(user => {
                        newGrantsForUsers.push(add({
                            entityId: user.id,
                            roleId: info[1].id,
                            privileges: privilegeArray
                        }));
                    });
                    return P.all(newGrantsForUsers);
                }
            });
    },
    getPrivilegesForPosition: function (role, user, position) {
        const privileges = [];
        return position.getRuleTypes()
            .then(ruleTypesArray => {
                console.log();
                ruleTypesArray.map(ruleType => {
                    privileges.push(ruleType.getPrivileges());
                });
                return P.all(privileges);
            })
            .then(result => {
                const privileges = [];
                result.map(somePrivileges => {
                    somePrivileges.map(privilege => {
                        privileges.push(privilege);
                    })
                });
                return P.all([
                    add({entityId: user.id, roleId: role.id, privileges: privileges}),
                    role.addPrivileges(privileges)]);
            });
    },
    deleteByUserIdAndRoleId: function (userId, roleId) {
        return models.Grant.destroy({
            where: {
                userId: userId,
                roleId: roleId
            }
        });
    },

    findManagersGrantsOfUserByTraineeId: function (userId) {
        return P.props({
            entityPrivileges: privilegeService.getPrivilegesForEntity(userId),
            managersRoles: roleService.findRolesWithDescriptionLike('manager')
        }).then(result => {
            const managersIds = [];
            const privilegesIds = [];
            result.entityPrivileges.map(privilege => {
                privilegesIds.push(privilege.id);
            });
            result.managersRoles.map(manager => {
                managersIds.push(manager.id);
            });
            return models.Grant.findAll({
                where: {
                    privilegeId: privilegesIds
                }
            })
                .then(grants=>{
                    const filteredGrants = [];
                    grants.map(grant => {
                       if(managersIds.includes(grant.roleId)){
                           filteredGrants.push(grant);
                       }
                    });
                    return P.all(filteredGrants);
                })
        });
    }
};

