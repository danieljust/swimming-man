const models = require('../models');
const createPrivilegeService = require('./createPrivilegeService');
const entityService = require('./entityService');
const positionService = require('./positionService');
const roleService = require('./roleService');
const privilegeService = require('./privilegeService');
const grantService = require('./grantService');
const P = require("bluebird");
const sequelize = require('../models/index').sequelize;
const uniq = require('lodash.uniq');

function findManagersIdByTraineeId (traineeId) {
    return grantService.findManagersGrantsOfUserByTraineeId(traineeId)
        .then(grants => {
            let managers = [];
            grants.map(grant => {
                managers.push(grant.userId)
            });
            return P.all(uniq(managers));
        })
}

function findAllTrainingsOfUser(userId){
    return models.Training.findAll({
        where: {
            userId: userId
        }
    });
}
module.exports = {
    getAllPrivilegesForAllTrainingsOfUser: function(userId){
        return findAllTrainingsOfUser(userId)
            .then(trainings => {
                const arrayOfArraysOfPrivileges = [];
                trainings.map(training => {
                    arrayOfArraysOfPrivileges.push(privilegeService.getByEntityId(training.id));
                });
                return P.all(arrayOfArraysOfPrivileges)
            })
            .then(arrayOfArraysOfPrivileges => {
                const arrayOfPrivilegesForTrainingsOfUser = [];
                arrayOfArraysOfPrivileges.map(arrayOfPrivileges => {
                    arrayOfPrivileges.map(privlege => {
                        arrayOfPrivilegesForTrainingsOfUser.push(privlege);
                    })
                });
                return P.all(arrayOfPrivilegesForTrainingsOfUser);
            })
    },
    appointSomeOneAboveTrainingsOfAnotherOne: function (someOnePosition, someOneId, anotherOneId) {
        if(someOnePosition !== 'admin'){
            return positionService.findByDescription(someOnePosition)
                .then(position => position.getRuleTypes())
                .then(ruleTypes => {
                    const possibleRuleTypeIds = [];
                    ruleTypes.map(ruleType => possibleRuleTypeIds.push(ruleType.id));
                    return P.props({
                        possibleRuleTypeIds: possibleRuleTypeIds,
                        trainings: models.Training.findAll({
                            where: {
                                userId: anotherOneId
                            }
                        })
                    });
                })
                .then(result => {
                    let possiblePrivilegesOnTrainings = [];
                    result.trainings.map(training => {
                        possiblePrivilegesOnTrainings.push(privilegeService.getPossiblePrivileges(training.id, result.possibleRuleTypeIds));
                    });
                    return P.props({
                        possiblePrivilegesArraysOnTrainings: P.all(possiblePrivilegesOnTrainings),
                        role: roleService.findRoleByDescription(`${someOnePosition}_${someOneId}`)
                    });
                })
                .then(result => {
                    const privilegesForFutureGrants = [];
                    result.possiblePrivilegesArraysOnTrainings.map(arrayOfPrivilegesOnTraining => {
                        arrayOfPrivilegesOnTraining.map(privilege => {
                            privilegesForFutureGrants.push(privilege);
                        })
                    });
                    return grantService.add({
                            entityId: someOneId,
                            roleId: result.role.id,
                            privileges: privilegesForFutureGrants
                        }
                    )
                })
        }
        else return P.resolve([]);
    },
    findTrainingsByUserId: function (userId, offset, limit, sortByCol, providedDirection) {
        const direction = providedDirection || 'DESC';
        const column = sortByCol || 'date';
        return models.Training.findAndCountAll({
            where: {
                userId: userId
            },
            order: [[sequelize.col(column), direction]],
            offset: offset,
            limit: limit
        });
    },
    createTraining: function (reqTraining) {
        return P.props({
            createdPrivileges: createPrivilegeService.getCreatePrivilegesByEntityType('training'),
            createdEntity: models.Training.create(reqTraining),
        })
        .then(result => {
            return P.props({
                privileges: entityService.addEntityPrivileges(result),
                createdEntity: result.createdEntity,
                managerIds: findManagersIdByTraineeId(reqTraining.userId)
            });
        })
        .then(result => {
            return P.props({
                userGrants: entityService.addTrainingDefaultGrants(result),
                managerGrants: P.map(result.managerIds, id => entityService.addTrainingGrantsToManager(
                    {createdEntity: result.createdEntity, privileges: result.privileges},
                    id))
            })
        })
        .then((result) => {
            return entityService.returnEntity(result.userGrants);
        });
    },
    findTraining: function (trainingId) {
        return models.Training.findOne({
            where: {
                id: trainingId
            }
        });
    },
    changeTrainingInfo: function (trainingId, reqTraining) {
        return models.Training.update(reqTraining, {
            where: {
                id: trainingId
            }
        });
    },
    deleteTrainingById: function (trainingId) {
        return models.Training.destroy({
            where: {
                id: trainingId
            }
        });
    },
    deleteAll: function () {
        return models.Training.destroy({
            where: {}
        });
    },
    findTrainingsForReport(userId, afterDate, beforeDate){
        return models.Training.findAll(
            {
                where: {
                    userId: userId,
                    date: {
                        gte: afterDate,
                        lte: beforeDate
                    }
                },
                attributes: {
                    include: [[sequelize.fn('AVG', sequelize.col('duration')), 'averageDuration'],
                        [sequelize.fn('AVG', sequelize.col('distance')), 'averageDistance'],
                        [sequelize.fn('SUM', sequelize.col('distance')), 'totalDistance'],
                        [sequelize.fn('SUM', sequelize.col('duration')), 'totalDuration'],
                        [sequelize.fn('COUNT', sequelize.col('duration')), 'quantity']
                    ]
                }
            });
    },
};
