const ruleTypesService = require('../../dao/ruleTypesService');
const privilegeService = require('../../dao/privilegeService');
const Promise = require("bluebird");

describe('Check ADD rule type', () => {
    beforeEach(function (done) {
        ruleTypesService.add('edit').then(res => {
            this.ruleTypeId = res.dataValues.id;
            done();
        });
    });
    afterEach(function (done) {
        Promise.all(
            [
                privilegeService.destroyAll(),
                ruleTypesService.destroyAll()
            ]
        ).then(done);
    });
    it('should add rule type in db', function (done) {
        privilegeService.add({entityId: 123, privileges: [{ruleTypeId: this.ruleTypeId}]})
            .then(() => privilegeService.checkPrivilege({entityId: 123, ruleTypeId: this.ruleTypeId})
            ).then(res => {
            if (res) {
                done();
            }
        });
    });
});
