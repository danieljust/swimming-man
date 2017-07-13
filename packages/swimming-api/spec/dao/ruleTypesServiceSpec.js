const ruleTypesService = require('../../dao/ruleTypesService');
const Promise = require("bluebird");

describe('Check ADD rule type', () => {
    afterEach(function (done) {
        ruleTypesService.destroyAll()
            .then(done);
    });
    it('should add rule type in db', done => {
        ruleTypesService.add('edit')
            .then(() => {
                return ruleTypesService.findRuleByDescription('edit');
            })
            .then(res => {
                if (res) {
                    expect(res.dataValues).toEqual(jasmine.objectContaining({
                        description: 'edit'
                    }));
                    done();
                }
            });
    });

    it('should add rule type in db', done => {
        Promise.all([
            ruleTypesService.add('edit'),
            ruleTypesService.add('view'),
            ruleTypesService.add('delete'),
            ruleTypesService.add('update')
        ])
            .then(() => {
                return ruleTypesService.destroyAll();
            })
            .then(quantity => {
                expect(quantity).toEqual(4);
                done();
            });
    });
});
