const pick = require('lodash.pick');
const models = require('../models');
const hashPassword = require('../utils/salting').hashPassword;
const createPrivilegeService = require('./createPrivilegeService');
const entityService = require('./entityService');
const grantService = require('./grantService');
const trainingService = require('./trainingService');
const positionService = require('./positionService');
const roleService = require('./roleService');
const privilegeService = require('./privilegeService');
const P = require("bluebird");
const filter = require('lodash.filter');

function createUser(reqUser) {
    return models.User.create(reqUser);
}
function getAllUsers() {
    return models.User.findAll({});
}
function getUserById(userId) {
    return models.User.findOne({where: {id: userId}});
}
function findUserByEmail(email) {
    return models.User.findOne({where: {email: email}});
}
function getRoleByDesc(desc) {
    return models.Role.findOne({where: {description: desc}})
}
function giveUserRole(userId, positionDescription) {
    return P.props({
        role: roleService.add(`${positionDescription}_${userId}`),
        user: getUserById(userId)
    })
        .then(result => {
            if (result.user !== null) {
                return result.user.addRole(result.role);
            } else {
                const err = new Error('No user with such id found');
                err.status = 404;
                return P.reject(err);
            }
        });
}
function demoteUserRole(userId, positionDescription) {
    return roleService.findRoleByDescription(`${positionDescription}_${userId}`)
        .then(role =>
            P.props({
                deletedGrants: grantService.deleteByUserIdAndRoleId(userId, role.id),
                deletedRole: roleService.destroy(`${positionDescription}_${userId}`)
            })
        )
        .then(result =>
            P.props({
                status: 'success'
            })
        );
}
function upgradeUserToAdmin(futureAdminId) {
    return giveUserRole(futureAdminId, 'admin')
        .then(() => getAllUsers())
        .then(users => {
            const adminGrants = [];
            const filteredUsers = filter(users, function (user) {
                return user.id !== futureAdminId;
            });
            filteredUsers.map(user => adminGrants.push(appointSomeOneAboveAnotherOne('admin', futureAdminId, user.id)));
            return P.all(adminGrants);
        });
}
function getPermitableUsers(userId, limit, offset) {
    return privilegeService.findLimitedWithRuleTypesAndGrants(userId, limit, offset)
        .then(result => grabUserIdsFromPrivileges(result))
        .then(user => findUsersByIds(user.Ids, user.count));
}
function getUserGrantsForOthers(userId, limit, offset) {
    return getPermitableUsers(userId, limit, offset)
        .then(usersObject => {
            const promises = [];
            usersObject.users.rows.map(user => {
                promises.push(P.props({
                    user: user,
                    actions: privilegeService.getUserGrantsForEntity(userId, user.id),
                    positions: getUserPositions(user.id)
                }));
            });
            const foundUsers = P.all(promises);
            return P.props({
                rows: foundUsers,
                count: usersObject.count
            });
        });
}
function grabUserIdsFromPrivileges(result) {
    const userIds = [];
    result.privileges.rows.map(privilege => {
        userIds.push(privilege.entityId);
    });
    return P.props({
        Ids: userIds,
        count: result.count
    })
}
function findUsersByIds(userIds, total) {
    if (userIds.length !== 0) {
        const foundUsers = models.User.findAndCountAll({
            where: {
                id: {
                    $in: userIds
                }
            }
        });
        return P.props({
            users: foundUsers,
            count: total
        });
    }
    else {
        return P.resolve([]);
    }
}
function findUsersByIdsWithoutLimit(userIds) {
    if (userIds.length !== 0) {
        return models.User.findAll({
            where: {
                id: {
                    $in: userIds
                }
            },
        });
    }
    else {
        return P.resolve([]);
    }
}
function appointSomeOneAboveAnotherOne(someOnePosition, someOneId, anotherOneId) {
    return trainingService.appointSomeOneAboveTrainingsOfAnotherOne(someOnePosition, someOneId, anotherOneId)
        .then(()=>positionService.findByDescription(someOnePosition))
        .then(position => position.getRuleTypes())
        .then(ruleTypes => {
            const possibleRuleTypeIds = [];
            ruleTypes.map(ruleType => {
                possibleRuleTypeIds.push(ruleType.id);
            });
            return P.props({
                possiblePrivileges: privilegeService.getPossiblePrivileges(anotherOneId, possibleRuleTypeIds),
                role: roleService.findRoleByDescription(`${someOnePosition}_${someOneId}`)
            });
        })
        .then(result => {
                return grantService.add({
                    entityId: someOneId,
                    roleId: result.role.id,
                    privileges: result.possiblePrivileges
                })
            }
        );
}
function removeSomeOneAboveAnotherOne(someOnePosition, someOneId, anotherOneId) {

    return P.props({
        role: roleService.findRoleByDescription(`${someOnePosition}_${someOneId}`),
        privileges: privilegeService.getByEntityId(anotherOneId),
        trainingsPrivileges: trainingService.getAllPrivilegesForAllTrainingsOfUser(anotherOneId)
    })
    .then(result => {
        const privilegeIds = [];
        result.privileges.map(privilege => {
            privilegeIds.push(privilege.id);
        });
        result.trainingsPrivileges.map(privilege => {
            privilegeIds.push(privilege.id);
        });
        return grantService.destroyByUserRolePrivilegeIds(someOneId, result.role.id, privilegeIds);
    });
}
function findUsersWithRolesLike(roleDesc) {
    return roleService.findRolesWithDescriptionLike(roleDesc)
        .then(roles => {
            if (roles.length !== 0) {
                const usersWithRole = [];
                roles.map(role => {
                    usersWithRole.push(role.getUsers());
                });
                return P.all(usersWithRole);
            } else {
                return P.all([]);
            }
        });
}

function grabAllUsersDataByPosition(position) {
    return findUsersWithRolesLike(position)
        .then(managersRole => {
            let managersArray = [];
            managersRole.map(managers=>{
                managers.map(manager => {
                    managersArray.push(pick(manager, ['id', 'firstName', 'lastName', 'email']));
                });
            });
            return P.all(managersArray);
        })
}

function getUserPositions (userId) {
    return getUserById(userId)
        .then(user => user.getRoles())
        .then(roles => {
            const positions = [];
            roles.map(role => {
                positions.push(positionService.extractFromRole(role));
            });
            return P.resolve(positions);
        });
}

module.exports = {
    viewAllowedUsers: getUserGrantsForOthers,
    findAll: function (limit, offset) {
        return models.User.findAndCountAll({
            limit: limit,
            offset: offset
        });
    },
    viewAllManagers: grabAllUsersDataByPosition,
    registerUser: function (data) {
        return hashPassword(data.registration.password)
            .then(hashedPassword => {
                const reqUser = {
                    email: data.registration.email,
                    password: hashedPassword,
                    firstName: data.registration.firstName,
                    lastName: data.registration.lastName
                };
                return P.props({
                    createdEntity: createUser(reqUser),
                    createPrivileges: createPrivilegeService.getCreatePrivilegesByEntityType('user')
                });
            })
            .then(result => {
                return P.props({
                    role: roleService.createRoleForNewUser(result.createdEntity),
                    createdPrivileges: result.createPrivileges,
                    createdEntity: result.createdEntity
                });
            })
            .then(result => {
                return P.props({
                    userRole: result.role.createdRole,
                    privileges: entityService.addEntityPrivileges(result),
                    createdEntity: result.createdEntity,
                })
            })
            .then(result =>
                P.props({
                    privileges: result.privileges,
                    rolePrivileges: result.userRole.addPrivileges(result.privileges),
                    defaultGrants: entityService.addUserDefaultGrants(result),
                    createdEntity: result.createdEntity,
                    allAdmins: findUsersWithRolesLike('admin_')
                })
            )
            .then(result => {
                if (result.allAdmins.length !== 0) {
                    const setAdmins = [];
                    result.allAdmins.map(roleAdmins => {
                        roleAdmins.map(admin => {
                            setAdmins.push(appointSomeOneAboveAnotherOne('admin', admin.id, result.createdEntity.id))
                        });
                    });
                    return P.props({
                        createdEntity: result.createdEntity,
                        allAdmins: setAdmins
                    });
                } else {
                    return P.props({
                        createdEntity: result.createdEntity,
                    });
                }
            })
            .then(result => entityService.returnEntity(result))
            .catch(err => P.reject(err));
    },
    promoteUser(userId, position){
        if (position === 'admin') {
            return upgradeUserToAdmin(userId);
        } else {
            return giveUserRole(userId, position);
        }
    },
    demoteUser: demoteUserRole,
    upgradeUserToAdmin: upgradeUserToAdmin,
    appointSomeOneAboveAnotherOne: appointSomeOneAboveAnotherOne,
    removeSomeOneAboveAnotherOne: removeSomeOneAboveAnotherOne,
    editUser: function (userId, info) {
        return getUserById(userId)
            .then(user => {
                if (user.length === 0){
                    const error = new Error('User not found');
                    error.status = 404;
                    throw error;
                }
                else{
                    return models.User.update(info, {
                        where: {
                            id: userId
                        }
                    });
                }
            })
    },
    findUserByEmail: function (userEmail) {
        return findUserByEmail(userEmail);
    },
    deleteRoleFromUser: function (userId, roleDesc) {
        return getRoleByDesc(roleDesc)
            .then(result =>
                P.props({
                        userRoleTable: models.UserRole.destroy({
                            where: {
                                userId: userId,
                                roleId: result.id
                            }
                        }),
                        rolePrivileges: result.getPrivileges()
                    }
                ))
            .then(result => {
                let ids = [];
                result.rolePrivileges.map(privilege => {
                    ids.push(privilege.id);
                });
                return grantService.destroyByPrivilegeIdsAndUserId(ids, userId);
            })
            .catch(err => P.reject(err));
    },
    changeGroup: function (userId, groupId) {
        return models.User.update({group: groupId}, {
            where: {
                id: userId
            }
        });
    },
    findUsersByIdsWithoutLimit: findUsersByIdsWithoutLimit,
    findUserById: function (userId) {
        return grantService.findManagersGrantsOfUserByTraineeId(userId)
            .then(grants => {
                let managers = [];
                grants.map(grant => {
                    managers.push(grant.userId);
                });
                return P.props({
                    user: getUserById(userId),
                    managers: managers,
                    positions: getUserPositions(userId)
                });
            })
    },
    deleteUserById: function (userId) {
        return models.User.destroy({
            where: {
                id: userId
            }
        });
    },
    deleteUserByEmail: function (email) {
        return models.User.destroy({
            where: {
                email: email
            }
        });
    },
    deleteAll: function () {
        return models.User.destroy({
            where: {}
        });
    },
    getUserPositions: getUserPositions
};
