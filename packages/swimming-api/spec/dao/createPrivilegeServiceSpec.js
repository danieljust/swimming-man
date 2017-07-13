const ruleTypesService = require('../../dao/ruleTypesService');
const createPrivilegeService = require('../../dao/createPrivilegeService');
const Promise = require("bluebird");

describe('Rule types and privileges', function () {
    afterEach(function (done) {
        Promise.all(
            [
                createPrivilegeService.destroyAll(),
                ruleTypesService.destroyAll()
            ]
        ).then(done);
    });
    it('should add 4 rule types and createPrivileges to it', done => {
            Promise.props({
                addEdit: ruleTypesService.add('edit'),
                addView: ruleTypesService.add('view'),
                addDelete: ruleTypesService.add('delete')
            })
                .then(result => {
                    return Promise.props({
                        addEditUser: createPrivilegeService.add({ruleTypeId: result.addEdit.id, entityType: 'user'}),
                        addEditTraining: createPrivilegeService.add({
                            ruleTypeId: result.addEdit.id,
                            entityType: 'training'
                        }),
                        addViewUser: createPrivilegeService.add({ruleTypeId: result.addView.id, entityType: 'user'}),
                        addViewTraining: createPrivilegeService.add({
                            ruleTypeId: result.addView.id,
                            entityType: 'training'
                        }),
                        addDeleteUser: createPrivilegeService.add({
                            ruleTypeId: result.addDelete.id,
                            entityType: 'user'
                        }),
                        addDeleteTraining: createPrivilegeService.add({
                            ruleTypeId: result.addDelete.id,
                            entityType: 'training'
                        })
                    });
                })
                .then(() => createPrivilegeService.getCreatePrivilegesByEntityType('user'))
                .then(res => {
                    expect(res.length).toEqual(3);
                    done();
                });
        }
    )
});

