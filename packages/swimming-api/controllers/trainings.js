const trainingService = require('../dao/trainingService');
const canProcessOne = require('../utils/canProcess').canProcessOne;

module.exports = {
    createTraining: function (req, res, next) {
        canProcessOne(req.user.id, req.body.training.userId, "add_training")
            .then(() => {
                const reqTraining = {
                    userId: req.body.training.userId,
                    date: req.body.training.date,
                    duration: parseInt(req.body.training.duration),
                    distance: parseInt(req.body.training.distance),
                    description: req.body.training.description
                };
                trainingService.createTraining(reqTraining)
                    .then(training => res.json({training: training}))
            })
            .catch(next);
    },
    getTrainingInfo: function (req, res, next) {
        canProcessOne(req.user.id, req.params.trainingId, "view_training", 'training')
            .then(() => trainingService.findTraining(req.params.trainingId))
            .then(training => {
                if (training === null) {
                    const err = new Error('No training with specified id');
                    err.status = 404;
                    next(err);
                } else {
                    res.json({
                        trainings: [training]
                    });
                }
            })
            .catch(next);
    },
    changeTrainingInfo: function (req, res, next) {
        const reqTraining = {
            date: req.body.training.date,
            duration: req.body.training.duration,
            distance: req.body.training.distance,
            description: req.body.training.description
        };
        canProcessOne(req.user.id, req.params.trainingId, "edit", 'training')
            .then(() => trainingService.changeTrainingInfo(req.params.trainingId, reqTraining))
            .then(result => {
                if (result[0] === 1) {
                    const reqTrainingRespDTO = {
                        id: req.params.trainingId,
                        userId: req.params.userId,
                        date: reqTraining.date,
                        duration: reqTraining.duration,
                        distance: reqTraining.distance,
                        description: reqTraining.description
                    };
                    res.json(reqTrainingRespDTO);
                } else {
                    next(new Error('No trainings were affected'));
                }
            })
            .catch(next);
    },
    deleteTrainingById: function (req, res, next) {
        canProcessOne(req.user.id, req.params.trainingId, "delete", 'training')
            .then(() => trainingService.deleteTrainingById(req.params.trainingId))
            .then(result => {
                if (result === 1) {
                    res.json({status: "success"});
                } else {
                    res.status(400).json({status: "fail"});
                }
            })
            .catch(next);
    },
    findTrainingsByUserId: function (req, res, next) {
        canProcessOne(req.user.id, req.query.userId, "view_trainings", 'user')
            .then(() => {
                const limit = req.query.perPage;
                const offset = (req.query.page - 1) * req.query.perPage;
                trainingService.findTrainingsByUserId(req.query.userId, offset, limit, req.query.sort, req.query.direction)
                    .then(trainings => {
                        res.json({
                            userId: req.query.userId,
                            trainings: trainings.rows,
                            meta: {
                                totalPages: trainings.count / limit
                            }
                        });
                    })
            })
            .catch(next);
    },
    getWeeklyReport: function (req, res, next) {
        const userId = req.query.userId;
        const afterDate = req.query.afterDate;
        const beforeDate = req.query.beforeDate;
        trainingService.findTrainingsForReport(userId, afterDate, beforeDate)
            .then(result => {
                if (result[0].dataValues.quantity !== 0) {
                    res.json({
                        report: [{
                            id: 0,
                            totalDistance: result[0].dataValues.totalDistance,
                            averageDistance: result[0].dataValues.averageDistance,
                            averageDuration: result[0].dataValues.averageDuration,
                            averageVelocity: result[0].dataValues.totalDistance / result[0].dataValues.totalDuration,
                            quantity: result[0].dataValues.quantity
                        }]
                    });
                } else {
                    res.json({
                        report: []
                    });
                }
            })
            .catch(next);
    }
};
