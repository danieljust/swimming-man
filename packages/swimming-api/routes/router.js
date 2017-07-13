const express = require('express');
const viewUsers = require('../controllers/users').viewAllowedUsers;
const getAllManagers = require('../controllers/users').getAllManagers;
const devFindAll = require('../controllers/users').findAll;
const registerUser = require('../controllers/users').registerUser;
const editUser = require('../controllers/users').editUser;
const findUser = require('../controllers/users').findUser;
const deleteAllUsers = require('../controllers/users').deleteAll;
const deleteUser = require('../controllers/users').deleteUserById;
const createAdmin = require('../controllers/users').createAdmin;
const changeGroup = require('../controllers/users').changeGroup;
const createTrainingPost = require('../controllers/trainings').createTraining;
const getUserTrainings = require('../controllers/trainings').findTrainingsByUserId;
const getTrainingInfo = require('../controllers/trainings').getTrainingInfo;
const changeTrainingInfo = require('../controllers/trainings').changeTrainingInfo;
const deleteTraining = require('../controllers/trainings').deleteTrainingById;
const getWeeklyReport = require('../controllers/trainings').getWeeklyReport;
const generateToken = require('../controllers/sessions').generateToken;
const authenticate = require('../middlewares/Authenticate');
const serialize = require('../middlewares/Serialize');
const prepareDB = require('../utils/prepareDB').prepareDB;
const promoteToPosition = require('../controllers/users').promoteToPosition;
const demoteFromPosition = require('../controllers/users').demoteFromPosition;
const appoint = require('../controllers/users').appoint;
const removeAppointment = require('../controllers/users').removeAppointment;
const expressJwt = require('express-jwt');
const authenticateJwt = expressJwt({secret: 'server secret'}).unless({
    path: ['/api/login', /^\/api\/dev\/.*/, '/api/registration']
});
const router = express.Router();

router.use(authenticateJwt);
router.get('/', function (req, res, next) {
    res.json({hello: 'World'});
});
router.post('/token', generateToken);
router.post('/registration', registerUser);
router.post('/login', authenticate, serialize, generateToken, function (req, res) {
    res.status(200).json({
        user: req.user,
        access_token: req.token
    });
});
router.get('/users', viewUsers);
router.get('/users/:userId', findUser);
router.put('/users/:userId', editUser);
router.put('/users/:userId/settings', changeGroup);

router.post('/trainings', createTrainingPost);
router.get('/trainings/:trainingId', getTrainingInfo);
router.put('/trainings/:trainingId', changeTrainingInfo);
router.delete('/trainings/:trainingId', deleteTraining);
router.get('/trainings', getUserTrainings);
router.get('/report', getWeeklyReport);
router.put('/position', promoteToPosition);
router.delete('/position', demoteFromPosition);
router.post('/appointment', appoint);
router.delete('/appointment', removeAppointment);

router.get('/dev/users', devFindAll);
router.get('/dev/users/:userId', findUser);
router.put('/dev/users/:userId', editUser);
router.get('/dev/trainings', getUserTrainings);
router.post('/dev/createAdmin', createAdmin);
router.put('/dev/position', promoteToPosition);
router.post('/dev/position', appoint);
router.delete('/dev/position', demoteFromPosition);

router.post('/dev/trainings', createTrainingPost);
router.get('/dev/trainings/:trainingId', getTrainingInfo);
router.put('/dev/trainings/:trainingId', changeTrainingInfo);
router.delete('/dev/trainings/:trainingId', deleteTraining);
router.delete('/dev/users', deleteAllUsers);
router.delete('/dev/users/:userId', deleteUser);
router.get('/dev/:userId/trainings', getUserTrainings);
router.get('/dev/prepareDb', prepareDB);
router.get('/managers', getAllManagers);
module.exports = router;

