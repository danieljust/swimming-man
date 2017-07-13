const models = require('../../models');
const userService = require('../../dao/userService');

describe('registerUser', () => {

    it('should create user and return user with fields equal to requested', function (done) {
        const reqUser = {
            registration: {
                email: "ololosha1@mail.com",
                password: 'password',
                firstName: 'firstName',
                lastName: 'lastName'
            }
        };
        userService.registerUser(reqUser)
            .then(user => {
                expect(user).toEqual(jasmine.objectContaining({
                    firstName: 'firstName',
                    lastName: 'lastName'
                }));
                done();
            }).catch(err => {
            console.log(err);
        });
    });
    it('should throw an error because email must be unique', function (done) {
        const reqUser = {
            registration: {
                email: "ololosha2@mail.com",
                password: 'password',
                firstName: 'firstName',
                lastName: 'lastName'
            }
        };
        userService.registerUser(reqUser)
            .then(user => {
                expect(user).toEqual(jasmine.objectContaining({
                    firstName: 'firstName',
                    lastName: 'lastName'
                }));
                return userService.registerUser(reqUser);
            })
            .catch(err => {
                expect(err).toEqual(jasmine.objectContaining({
                    name: 'SequelizeUniqueConstraintError',
                    message: 'User with this email already registered'
                }));
                done();
            });
    });
});
