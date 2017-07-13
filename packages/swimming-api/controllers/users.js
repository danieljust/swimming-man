const userService = require('../dao/userService');
const trainingService = require('../dao/trainingService');
const canProcessOne = require('../utils/canProcess').canProcessOne;
const userDTO = require('../dto/UserDTO');
const P = require("bluebird");

module.exports = {
    findAll: function (req, res, next) {
        const limit = req.query.perPage;
        const offset = (req.query.page - 1) * req.query.perPage;
        userService.findAll(limit, offset)
            .then(users => res.status(200).json(userDTO.findAllResponse(users, limit)))
            .catch(next);
    },
    viewAllowedUsers: function (req, res, next) {
        const limit = req.query.perPage;
        const offset = (req.query.page - 1) * req.query.perPage;
        const userId = req.user.id;
        userService.viewAllowedUsers(userId, limit, offset)
            .then(result => {
                res.status(200).json(userDTO.viewAllResponse(result, limit))
            })
            .catch(next);
    },
    getAllManagers: function (req, res, next) {
        userService.viewAllManagers("manager_")
            .then(result => res.status(200).json(userDTO.viewAllManagersResponse(result)))
            .catch(next);
    },
    registerUser: function (req, res, next) {
        userService.registerUser(req.body)
            .then(user => res.status(200).json(userDTO.userCreationResponse(user)))
            .catch(next);
    },
    loginUser: function (req, res, next) {
        userService.loginUser(userDTO.loginRequest(req.body))
            .then(result => res.json({group: result}))
            .catch(next);
    },
    editUser: function (req, res, next) {
        const info = userDTO.userEditingInfo(req);
        const userId = req.user.id;
        const entityId = req.params.userId;
        const actionType = "edit";
        canProcessOne(userId, entityId, actionType, 'user')
            .then(() => userService.editUser(req.params.userId, info))
            .then(result => {
                if (result[0] === 1) {
                    res.json(info);
                } else {
                    next(new Error('No users were affected'));
                }
            })
            .catch(next);
    },
    createAdmin: function (req, res, next) {
        userService.registerUser(userDTO.adminInfo())
            .then(user => userService.upgradeUserToAdmin(user.id))
            .then(result => res.json({status: "success"}))
            .catch(next);
    },
    promoteToPosition: function (req, res, next) {
        canProcessOne(req.user.id, req.body.userId, `promoteTo_${req.body.position}`)
            .then(() => userService.promoteUser(req.body.userId, req.body.position))
            .then(result => res.json(userDTO.promoteRoleResponse(req, result)))
            .catch(next);
    },
    demoteFromPosition: function (req, res, next) {
        canProcessOne(req.user.id, req.body.userId, `demoteFrom_${req.body.position}`)
            .then(() => userService.demoteUser(req.body.userId, req.body.position))
            .then(result => res.json({status: "Role deleted"}))
            .catch(next);
    },
    appoint: function (req, res, next) {
        canProcessOne(req.user.id, req.body.managerId, `appoint_${req.body.position}`)
            .then(() => {
                userService.appointSomeOneAboveAnotherOne(req.body.position, req.body.managerId, req.body.userId);
            })
            .then(result => res.status(200).json({status: 'Success'}))
            .catch(next);
    },
    removeAppointment: function (req, res, next) {
        canProcessOne(req.user.id, req.body.managerId, `remove_${req.body.position}`)
            .then(() => userService.removeSomeOneAboveAnotherOne(req.body.position, req.body.managerId, req.body.userId))
            .then(result => res.json({status: 'Successfully removed from post', grantsDeleted: result}))
            .catch(next);
    },
    changeGroup: function (req, res, next) {
        userService.changeGroup(req.params.userId, 1)
            .then(result => {
                if (result[0] === 1) {
                    res.json('User rights upgraded');
                } else {
                    next(new Error('No users were affected'));
                }
            })
            .catch(next);
    },
    findUser: function (req, res, next) {
        const userId = req.user.id;
        const entityId = req.params.userId;
        const actionType = "view_user";
        canProcessOne(userId, entityId, actionType, 'user')
            .then(() => {
                return userService.findUserById(req.params.userId);
            })
            .then(user => {
                if (user !== null) {
                    res.json(userDTO.viewOneResponse(user));
                }
            })
            .catch(next);
    },
    deleteAll: function (req, res, next) {
        userService.deleteAll()
            .then(quantity => res.json(userDTO.deleteAllResponse(quantity)))
            .catch(next);
    },
    deleteUserById: function (req, res, next) {
        userService.deleteUserById(req.params.userId)
            .then(quantity => res.json(userDTO.deleteOneResponse(quantity)))
            .catch(next);
    }
};
