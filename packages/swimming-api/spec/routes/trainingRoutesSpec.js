const request = require('supertest');
const app = require('../../app');
const userService = require('../../dao/userService');
const trainingService = require('../../dao/trainingService');
const createPrivilegeService = require('../../dao/createPrivilegeService');
const ruleTypesService = require('../../dao/ruleTypesService');
const addRules = require('../../utils/prepareDB').addRules;
const faker = require('faker');
const Promise = require("bluebird");
const moment = require("moment");

describe('Test for training endpoints', () => {
    beforeEach(function (done) {
        const reqUser = {
            email: faker.internet.email(),
            password: "123456",
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName()
        };
        addRules()
            .then(() =>
                request(app)
                    .post('/api/registration')
                    .send({registration: reqUser})
                    .expect(200)
            )
            .then(res => {
                this.createdUserId = res.body.registration.id;
                return request(app)
                    .post('/api/login')
                    .send({
                        username: reqUser.email,
                        password: reqUser.password
                    })
                    .expect(200)
            })
            .then(res => {
                this.userToken = res.body.access_token;
                done();
            });
    });
    afterEach(function (done) {
        Promise.all([
            userService.deleteAll(),
            trainingService.deleteAll(),
            createPrivilegeService.destroyAll(),
            ruleTypesService.destroyAll()
        ]).then(done);
    });
    it('should check that response contains all specified properties', function (done) {
        const reqTraining = {
            userId: this.createdUserId,
            date: new Date(),
            distance: 100,
            duration: 1000,
            description: 'That was cool!'
        };
        request(app)
            .post(`/api/trainings`)
            .set({"Authorization": "Bearer " + this.userToken})
            .send({training: reqTraining})
            .expect(200)
            .then(res => {
                expect(Object.keys(res.body.training)).toContain('id', 'userId', 'date', 'duration', 'description');
                done();
            })
            .catch(err => {
                done();
            });
    });
    it('should get training info successfully with status 200', function (done) {
        const reqTraining = {
            userId: this.createdUserId,
            date: new Date(),
            distance: 100,
            duration: 1000,
            description: faker.lorem.sentence()
        };
        request(app)
            .post(`/api/trainings`)
            .set({"Authorization": "Bearer " + this.userToken})
            .send({training: reqTraining})
            .expect(200)
            .then(res => {
                const trainingId = res.body.training.id;
                return request(app)
                    .get(`/api/trainings/${trainingId}?userId=${this.createdUserId}`)
                    .set({"Authorization": "Bearer " + this.userToken})
                    .expect(200);
            })
            .then(res => {
                expect(Object.keys(res.body.trainings[0])).toContain('id', 'userId', 'date', 'duration', 'description');
                done();
            });
    });
    it('should get trainings specified for weekly report', function (done) {
        const addTraining = myDate => {
            const reqTraining = {
                userId: this.createdUserId,
                date: myDate,
                distance: 100,
                duration: 1337,
                description: 'That was cool!'
            };
            return request(app)
                .post(`/api/trainings`)
                .set({"Authorization": "Bearer " + this.userToken})
                .send({training: reqTraining})
                .expect(200);
        };
        return Promise.all([
            addTraining(moment("2017-03-30","YYYY-MM-DD")),
            addTraining(moment("2017-03-24","YYYY-MM-DD")),
            addTraining(moment("2017-03-20","YYYY-MM-DD"))
        ])
            .then(() => {
                const aDate = moment("2017-03-15","YYYY-MM-DD");
                const bDate = moment("2017-03-29","YYYY-MM-DD");
                return request(app)
                    .get(`/api/report?userId=${this.createdUserId}&afterDate=${aDate}&beforeDate=${bDate}`)
                    .set({"Authorization": "Bearer " + this.userToken});
            })
            .then(res => {
                    expect(res.body.report[0]).toEqual(jasmine.objectContaining({
                        totalDistance: 200,
                        averageDistance: 100,
                        averageDuration: 1337
                    }));
                    done();
                }
            ).catch(err => {
                console.log(err);
            });
    });
    xit('should delete training info successfully with status 200')
        .pend('implement this test');
    xit('should update training info successfully with status 200')
        .pend('implement this test');
    xit('should check that 401 if parameters wrong for new training')
        .pend('implement training model restrictions first');
});
