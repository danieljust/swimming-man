const roleService = require('../dao/roleService');
const userService = require('../dao/userService');
const ruleTypesService = require('../dao/ruleTypesService');
const privilegeService = require('../dao/privilegeService');
const trainingService = require('../dao/trainingService');
const positionService = require('../dao/positionService');
const createPrivilegeService = require('../dao/createPrivilegeService');
const P = require("bluebird");
const faker = require('faker');

module.exports = {
    prepareDB: function (req, res, next) {
        P.all(
            [
                addRules()
            ])
            .then(() => addManyUsersWithoutTrainings(3))
            .then(() => addManyUsersWithTrainings(8))
            .then(() =>
            {
                res.json({result: 'Check DB'});
            })
            .catch(err => {
                console.log(err);
                res.json({result: 'Error occured'});
            });
    },
    addRules: function () {
        return addRules();
    }
};
function addPositions() {
    return P.props({
        manager: positionService.add('manager'),
        admin: positionService.add('admin'),
        user: positionService.add('user'),
        overseer: positionService.add('overseer')
    });
}

function addRules() {
    return addPositions()
        .then(positionsData => {
            return P.props({
                positionsData: positionsData,
                viewTrainings: ruleTypesService.add('view_trainings'),
                addAddTraining: ruleTypesService.add('add_training'),
                addEdit: ruleTypesService.add('edit'),
                addViewTraining: ruleTypesService.add('view_training'),
                addViewUser: ruleTypesService.add('view_user'),
                addDelete: ruleTypesService.add('delete'),
                addPromote: ruleTypesService.add('promoteTo_manager'),
                addDemote: ruleTypesService.add('demoteFrom_manager'),
                addAppointManager: ruleTypesService.add('appoint_manager'),
                addRemoveManager: ruleTypesService.add('remove_manager'),
            });
        })
        .then(result => {
            let defaultActions = [];
            const p = result.positionsData;
            defaultActions.push(p.user.addRuleType(result.addEdit));
            defaultActions.push(p.user.addRuleType(result.addDelete));
            defaultActions.push(p.user.addRuleType(result.addAddTraining));
            defaultActions.push(p.user.addRuleType(result.addViewTraining));
            defaultActions.push(p.user.addRuleType(result.addViewUser));
            defaultActions.push(p.user.addRuleType(result.viewTrainings));
            defaultActions.push(p.manager.addRuleType(result.addAddTraining));
            defaultActions.push(p.manager.addRuleType(result.viewTrainings));
            defaultActions.push(p.manager.addRuleType(result.addEdit));
            defaultActions.push(p.manager.addRuleType(result.addViewTraining));
            defaultActions.push(p.manager.addRuleType(result.addViewUser));
            defaultActions.push(p.manager.addRuleType(result.addDelete));
            defaultActions.push(p.admin.addRuleType(result.addPromote));
            defaultActions.push(p.admin.addRuleType(result.addViewTraining));
            defaultActions.push(p.admin.addRuleType(result.addViewUser));
            defaultActions.push(p.admin.addRuleType(result.addDemote));
            defaultActions.push(p.admin.addRuleType(result.addAppointManager));
            defaultActions.push(p.admin.addRuleType(result.addRemoveManager));
            return P.props({
                pos: defaultActions,
                addEdit: result.addEdit,
                addDelete: result.addDelete,
                addViewUser: result.addViewUser,
                addViewTraining: result.addViewTraining,
                addAddTraining: result.addAddTraining,
                viewTrainings: result.viewTrainings,
                addPromote: result.addPromote,
                addDemote: result.addDemote,
                addAppointManager: result.addAppointManager,
                addRemoveManager: result.addRemoveManager
            });
        })
        .then(result =>{
            return P.all([
                createPrivilegeService.add({ruleTypeId: result.addEdit.id, entityType: 'user'}),
                createPrivilegeService.add({ruleTypeId: result.addAddTraining.id, entityType: 'user'}),
                createPrivilegeService.add({ruleTypeId: result.viewTrainings.id, entityType: 'user'}),
                createPrivilegeService.add({ruleTypeId: result.addPromote.id, entityType: 'user'}),
                createPrivilegeService.add({ruleTypeId: result.addDemote.id, entityType: 'user'}),
                createPrivilegeService.add({ruleTypeId: result.addAppointManager.id, entityType: 'user'}),
                createPrivilegeService.add({ruleTypeId: result.addViewUser.id, entityType: 'user'}),
                createPrivilegeService.add({ruleTypeId: result.addDelete.id, entityType: 'user'}),
                createPrivilegeService.add({ruleTypeId: result.addRemoveManager.id, entityType: 'user'}),
                createPrivilegeService.add({ruleTypeId: result.addEdit.id, entityType: 'training'}),
                createPrivilegeService.add({ruleTypeId: result.addViewTraining.id, entityType: 'training'}),
                createPrivilegeService.add({ruleTypeId: result.addDelete.id, entityType: 'training'})
            ])});
}

function addUser() {
    const userData = {
        registration: {
            email: faker.internet.email(),
            password: "123456",
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName()
        }
    };
    userService.registerUser(userData);
}
function addManyUsersWithoutTrainings(count) {
    for (let i = 0; i < count; i++) {
        addUser();
    }
    return P.resolve(true);
}
function addUserWithTrainings(count) {
    const userData = {
        registration: {
            email: faker.internet.email(),
            password: "123456",
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName()
        }
    };
    userService.registerUser(userData)
        .then(user => {
            addManyTrainingsToUser(user.id, count);
        });
}
function addManyUsersWithTrainings(count) {
    for (let i = 0; i < count; i++) {
        addUserWithTrainings(faker.random.number({min:10, max: 30}));
    }
    return P.resolve(true);
}
function addManyTrainingsToUser(userId, count) {
    for (let i = 0; i < count; i++) {
        addTraining(userId);
    }
}
function addTraining(userId) {
    const trainingData = {
        userId: userId,
        date: faker.date.between('2017-01-01', new Date()),
        distance: faker.random.number({min: 100, max: 1000}),
        duration: faker.random.number({min: 1000, max: 6000}),
        description: faker.lorem.sentence()
    };
    trainingService.createTraining(trainingData);
}
