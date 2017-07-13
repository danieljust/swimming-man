const roleService = require('../../dao/roleService');
const userService = require('../../dao/userService');
const Promise = require("bluebird");
const faker = require('faker');

describe('Check ADD rule type', () => {
    afterEach(function (done) {
        Promise.all(
            [
                userService.deleteAll(),
                roleService.destroyAll()
            ])
            .then(done);
    });
    it('should add role to user in db', done => {
        const reqUser = {
            registration: {
                email: faker.internet.email(),
                password: faker.internet.userName(),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName()
            }
        };
        Promise.props({
            User: userService.registerUser(reqUser),
            Role: roleService.add('admin')
        })
            .then(result => result.Role.addUser(result.User))
            .then(done);
    });

    it('should add 3 rule types in db', done => {
        return Promise.all([
            roleService.add('admin'),
            roleService.add('user'),
            roleService.add('manager')]).then(done);
    });


    it('should add 3 rule types in db and check that actually 3 rules were deleted', done => {
        Promise.all([
            roleService.add('admin'),
            roleService.add('user'),
            roleService.add('manager')
        ])
            .then(() => {
                return roleService.destroyAll();
            })
            .then(quantity => {
                expect(quantity).toEqual(3);
                done();
            });
    });
})
;
