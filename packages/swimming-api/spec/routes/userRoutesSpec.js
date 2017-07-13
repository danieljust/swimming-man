const request = require('supertest');
const app = require('../../app');
const userService = require('../../dao/userService');
const grantService = require('../../dao/grantService');
const ruleTypesService = require('../../dao/ruleTypesService');
const createPrivilegeService = require('../../dao/createPrivilegeService');
const Promise = require("bluebird");
const faker = require('faker');

describe('Registering user', () => {
    beforeEach(function (done) {
        Promise.props({
            addEdit: ruleTypesService.add('edit'),
            addView: ruleTypesService.add('view'),
            addDelete: ruleTypesService.add('delete')
        })
            .then(result =>
                Promise.props({
                    addEditUser: createPrivilegeService.add({ruleTypeId: result.addEdit.id, entityType: 'user'}),
                    addViewUser: createPrivilegeService.add({ruleTypeId: result.addView.id, entityType: 'user'}),
                    addDeleteUser: createPrivilegeService.add({ruleTypeId: result.addDelete.id, entityType: 'user'})
                }))
            .then(done);
    });
    afterEach(function (done) {
        Promise.all([
            ruleTypesService.destroyAll(),
            createPrivilegeService.destroyAll()
        ])
            .then(done);
    });
    it('should register user and get all his grants', done => {
        const reqUser = {
            registration: {
                email: faker.internet.email(),
                password: "123456",
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName()
            }
        };
        request(app)
            .post('/api/registration')
            .send(reqUser)
            .expect(200)
            .then(res => grantService.getUserGrantsByUserId(res.body.registration.id))
            .then(res => {
                expect(res.length).toEqual(3);
                done();
            });
    });
    it('should successfully register user with status 200', done => {
        const reqUser = {
            registration: {
                email: faker.internet.email(),
                password: "123456",
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName()
            }
        };
        request(app)
            .post('/api/registration')
            .send(reqUser)
            .expect(200, done)
    });
    it('should register user and check that id field not null', done => {
        const reqUser = {
            registration: {
                email: faker.internet.email(),
                password: "123456",
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName()
            }
        };
        request(app)
            .post('/api/registration')
            .send(reqUser)
            .expect(200)
            .then(res => {
                expect(res.body.registration.id).not.toBe(null);
                done();
            });
    });
    it('should successfully register and check response.data fields', done => {
        const reqEmail = faker.internet.email();
        const reqFirstName = faker.name.firstName();
        const reqLastName = faker.name.lastName();
        const reqUser = {
            registration: {
                email: reqEmail,
                password: "123456",
                firstName: reqFirstName,
                lastName: reqLastName
            }
        };
        request(app)
            .post('/api/registration')
            .send(reqUser)
            .expect(200)
            .then(res => {
                expect(res.body.registration).toEqual(jasmine.objectContaining({
                    firstName: reqFirstName,
                    lastName: reqLastName
                }));
                expect(Object.keys(res.body.registration)).toContain('id');
                done();
            });
    });
    it('should try to register user but get 400 with specified error msg about email', done => {
        const reqUser = {
            registration: {
                email: faker.internet.email(),
                password: faker.internet.userName(),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName()
            }
        };
        request(app)
            .post('/api/registration')
            .send(reqUser)
            .expect(200)
            .then(() =>
                request(app)
                    .post('/api/registration')
                    .send(reqUser)
                    .expect(400))
            .then(res => {
                expect(res.body.errors).toEqual(jasmine.objectContaining({
                    email: 'User with this email already registered',
                }));
                done();
            });
    });
});

describe('Logging user', () => {
    beforeEach(function (done) {
        this.reqUser = {
            email: faker.internet.email(),
            password: faker.internet.userName(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName()
        };
        request(app)
            .post('/api/registration')
            .send({registration: this.reqUser})
            .expect(200, done);
    });
    afterEach(function (done) {
        userService.deleteUserByEmail(this.reqUser.email)
            .then(done);
    });
    it('should successfully log user in with status 200', function (done) {
        request(app)
            .post('/api/login')
            .send({
                username: this.reqUser.email,
                password: this.reqUser.password
            })
            .expect(200)
            .then(done);
    });
    it('should check that token present in response body', function (done) {
        request(app)
            .post('/api/login')
            .send({
                username: this.reqUser.email,
                password: this.reqUser.password
            })
            .expect(200)
            .then(res => {
                expect(res.body.access_token).not.toBe(null);
                done();
            });
    });
    it('should check res status is 401, wrong pwd', function (done) {
        request(app)
            .post('/api/login')
            .send({
                username: this.reqUser.email,
                password: faker.internet.userName()
            })
            .expect(401, done);
    });
    it('should check res status is 401, wrong email', function (done) {
        request(app)
            .post('/api/login')
            .send({
                username: faker.internet.email(),
                password: this.reqUser.password
            })
            .expect(401, done);
    });
});

describe('Working with user info', () => {
    beforeEach(function (done) {
        this.reqUser = {
            email: faker.internet.email(),
            password: faker.internet.userName(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName()
        };
        Promise.props({
            addEdit: ruleTypesService.add('edit'),
            addView: ruleTypesService.add('view'),
            addDelete: ruleTypesService.add('delete')
        })
            .then(result =>
                Promise.props({
                    addEditUser: createPrivilegeService.add({ruleTypeId: result.addEdit.id, entityType: 'user'}),
                    addViewUser: createPrivilegeService.add({ruleTypeId: result.addView.id, entityType: 'user'}),
                    addDeleteUser: createPrivilegeService.add({ruleTypeId: result.addDelete.id, entityType: 'user'})
                }))
            .then(() => request(app)
                .post('/api/registration')
                .send({registration: this.reqUser})
                .expect(200))
            .then(res => {
                this.createdUserId = res.body.registration.id;
                return request(app)
                    .post('/api/login')
                    .send({
                        username: this.reqUser.email,
                        password: this.reqUser.password
                    })
                    .expect(200);
            })
            .then(res => {
                this.userToken = res.body.access_token;
                done();
            });
    });
    afterEach(function (done) {
        userService.deleteAll()
            .then(done);
    });
    it('should get user info and response with object containing necessary fields', function (done) {
        request(app)
            .get('/api/users/' + this.createdUserId)
            .set({"Authorization": "Bearer " + this.userToken})
            .expect(200)
            .then(res => {
                expect(Object.keys(res.body.users[0])).toContain('firstName');
                expect(Object.keys(res.body.users[0])).toContain('lastName');
                done();
            });
    });
    it('should update user info', function (done) {
        const updatedUser = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            group: 0
        };
        request(app)
            .put('/api/users/' + this.createdUserId)
            .set({"Authorization": "Bearer " + this.userToken})
            .send({user: updatedUser})
            .expect(200)
            .then(res => {
                expect(res.body).toEqual(jasmine.objectContaining({
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    group: updatedUser.group
                }));
                done();
            });
    });

    xit('should retrieve user info as manager').pend('This feature not yet implemented');
})
;

xdescribe('Admin features', () => {
    xit('should promote regular user to manager').pend('Implement admin features');
    xit('should demote manager to regular user').pend('Implement admin features');
});
