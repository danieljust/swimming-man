const ruleTypesService = require('../../dao/ruleTypesService');
const privilegeService = require('../../dao/privilegeService');
const userService = require('../../dao/userService');
const grantService = require('../../dao/grantService');
const faker = require('faker');
const Promise = require("bluebird");

describe('Check ADD grant', function () {
    beforeEach(function (done) {
        const reqUser = {
            registration: {
                email: faker.internet.email(),
                password: faker.internet.userName(),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName()
            }
        };
        Promise.props({
            addUser: userService.registerUser(reqUser),
            addEdit: ruleTypesService.add('edit'),
            addView: ruleTypesService.add('view'),
            addDelete: ruleTypesService.add('delete')
        })
            .then(result => {
                this.userId = result.addUser.dataValues.id;
                this.editId = result.addEdit.dataValues.id;
                this.viewId = result.addView.dataValues.id;
                this.deleteId = result.addDelete.dataValues.id;
                return Promise.props({
                    addEditPriv: privilegeService.add(
                        {
                            entityId: this.userId,
                            privileges: [{ruleTypeId: this.editId}]
                        }),
                    addViewPriv: privilegeService.add(
                        {
                            entityId: this.userId,
                            privileges: [{ruleTypeId: this.viewId}]
                        }),
                    addDeletePriv: privilegeService.add({
                        entityId: this.userId,
                        privileges: [{ruleTypeId: this.deleteId}]
                    }),
                });
            })
            .then(result => {
                this.editPrivId = result.addEditPriv[0].dataValues.id;
                this.viewPrivId = result.addViewPriv[0].dataValues.id;
                this.deletePrivId = result.addDeletePriv[0].dataValues.id;
                done();
            });
    });
    afterEach(function (done) {
        Promise.all(
            [
                userService.deleteAll(),
                privilegeService.destroyAll(),
                ruleTypesService.destroyAll()
            ]
        ).then(done);
    });

    it('should add edit grant to user', function (done) {
        grantService.add({entityId: this.userId, privileges: [{id: this.editPrivId}]})
            .then(res => {
                expect(res[0].dataValues).toEqual(jasmine.objectContaining({
                    userId: this.userId,
                    privilegeId: this.editPrivId
                }));
                done();
            });
    });
    it('should get all user grants', function (done) {
        Promise.all([
            grantService.add({entityId: this.userId, privileges: [{id: this.editPrivId}]}),
            grantService.add({entityId: this.userId, privileges: [{id: this.viewPrivId}]}),
            grantService.add({entityId: this.userId, privileges: [{id: this.deletePrivId}]}),
        ])
            .then(() => grantService.getUserGrantsByUserId(this.userId))
            .then(res => {
                expect(res.length).toEqual(3);
                done();
            });
    });
});
