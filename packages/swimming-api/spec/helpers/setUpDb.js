const models = require('../../models');
const createPrivilegeService = require('../../dao/createPrivilegeService');
const grantService = require('../../dao/grantService');
const privilegeService = require('../../dao/privilegeService');
const roleService = require('../../dao/roleService');
const ruleTypesService = require('../../dao/ruleTypesService');
const trainingService = require('../../dao/trainingService');
const userService = require('../../dao/userService');
const Promise = require('bluebird');


beforeEach(function (done) {
    Promise.all([
        createPrivilegeService.destroyAll(),
        grantService.destroyAll(),
        privilegeService.destroyAll(),
        roleService.destroyAll(),
        ruleTypesService.destroyAll(),
        trainingService.deleteAll(),
        userService.deleteAll()
    ])
        .then(done);
});
beforeAll(done => {
    models.sequelize.sync({force: true}).then(() => {
        done();
    });
});
afterAll(done => {
    models.sequelize.close();
    done();
});
