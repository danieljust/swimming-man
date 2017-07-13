const models = require('../models');
const P = require('bluebird');
const uniq = require('lodash.uniq');

module.exports = {
    add: function (data) {
        const userId = data.entityId;
        const privilegeBulk = data.privileges;
        const privileges = [];
        privilegeBulk.map(privilege => {
            privileges.push({
                entityId: userId,
                ruleTypeId: privilege.ruleTypeId
            })
        });
        return models.Privilege.bulkCreate(privileges);
    },
    getByEntityId: function (entityId) {
        return models.Privilege.findAll({
            where: {
                entityId: entityId
            }
        });
    },
    checkPrivilege: function (privilege) {
        return models.Privilege.findOne({
            where: {
                entityId: privilege.entityId,
                ruleTypeId: privilege.ruleTypeId
            }
        });
    },
    canProcess: function (userId, entityId, action, entityType) {
        const entity = entityType || [];
        if (entity === 'user') {
            models.User.findAll({where: {id: entityId}})
                .then(user => {
                    if (user.length === 0) {
                        const error = new Error('User not found');
                        error.status = 404;
                        throw error;
                    }
                })
        }
        if (entity === 'training') {
            models.Training.findAll({where: {id: entityId}})
                .then(user => {
                    if (user.length === 0) {
                        const error = new Error('Training not found');
                        error.status = 404;
                        throw error;
                    }
                })
        }
        return models.Privilege.findAll({
            where: {
                entityId: entityId
            },
            include: [
                {
                    model: models.RuleType,
                    where: {
                        description: action
                    },
                },
                {
                    model: models.Grant,
                    where: {
                        userId: userId
                    }
                }
            ]
        })
            .then(resultArray => {
                if (resultArray.length === 0) {
                    const error = new Error('Access denied');
                    error.status = 403;
                    throw error;
                }
                return true;
            });

    },
    getUserGrantsForEntity: function (userId, entityId) {
        return models.Privilege.findAll({
            where: {
                entityId: entityId
            },
            include: [
                {
                    model: models.RuleType
                },
                {
                    model: models.Grant,
                    where: {
                        userId: userId
                    }
                }
            ]
        });
    },
    getAll: function () {
        return models.Privilege.findAll();
    },
    getPossiblePrivileges: function (entityId, ruleTypeIds) {
        return models.Privilege.findAll({
            where: {
                entityId: entityId,
                ruleTypeId: {
                    $in: ruleTypeIds
                }
            }
        });
    },
    destroy: function (privilege) {
        return models.Privilege.destroy({
            where: {
                entityId: privilege.entityId,
                ruleTypeId: privilege.ruleTypeId
            }
        });
    },
    destroyAll: function () {
        return models.Privilege.destroy({
            where: {}
        });
    },
    findLimitedWithRuleTypesAndGrants: function (userId, limit, offset) {
        return P.props({
            privileges: models.Privilege.findAndCountAll({
                limit: limit,
                offset: offset,
                include: [
                    {
                        model: models.RuleType,
                        where: {
                            description: "view_user"
                        },
                    },
                    {
                        model: models.Grant,
                        where: {
                            userId: userId
                        }
                    }
                ]
            }),
            count: models.Privilege.findAndCountAll({
                include: [
                    {
                        model: models.RuleType,
                        where: {
                            description: "view_user"
                        },
                    },
                    {
                        model: models.Grant,
                        where: {
                            userId: userId
                        }
                    }
                ]
            })
                .then(privileges => {
                    const entityIds = [];
                    privileges.rows.map(privilege => {
                        entityIds.push(privilege.entityId);
                    });
                    const uniqueEntityIds = uniq(entityIds);
                    return P.resolve(uniqueEntityIds.length);
                })
        })
    },
    getPrivilegesForEntity: function (entityId) {
        return models.Privilege.findAll({
            where: {
                entityId: entityId
            }
        })
    }
};
