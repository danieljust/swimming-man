const pick = require('lodash.pick');
const distinct = require('lodash.uniq');

module.exports = {
    viewAllResponse: function (data, limit) {
        const users = [];
        if (data.rows.length !== 0) {
            data.rows.map(onePersonInfo => {
                const sampleUser = pick(onePersonInfo.user, ['id', 'firstName', 'lastName', 'email']);
                sampleUser.actions = onePersonInfo.actions.map(action => {
                    return action.RuleType.description;
                });
                sampleUser.positions = {
                    isManager: onePersonInfo.positions.includes('manager')
                };
                const isManager = onePersonInfo.positions.includes('manager');
                const isUser = onePersonInfo.positions.includes('user');
                if(isManager){
                    sampleUser.positions.name = ('Manager');
                }
                if(isUser && !isManager){
                    sampleUser.positions.name = ('User');
                }
                users.push(sampleUser);
            });
        }
        return {
            users: users,
            meta: {
                totalPages: data.count / limit
            }
        };
    },
    findAllResponse: function (data, limit) {
        const users = [];
        if (data.count !== 0) {
            data.rows.map(onePersonInfo => {
                users.push(pick(onePersonInfo, ['id', 'firstName', 'lastName', 'email']));
            });
        }
        return {
            users: users,
            meta: {
                totalPages: data.count / limit
            }
        };
    },
    userCreationResponse: function (user) {
        return {
            registration: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        };
    },
    loginRequest: function (data) {
        return {
            email: data.email,
            password: data.password
        };
    },
    userEditingInfo: function (data) {
        return {
            firstName: data.body.user.firstName,
            lastName: data.body.user.lastName,
            group: data.body.user.group
        };
    },
    promoteRoleResponse: function (req, result) {
        return {
            userId: req.body.userId,
            roleGiven: result
        };
    },
    demoteRoleResponse: function (req, result) {
        return {
            userId: req.body.userId,
            roleDemoted: result
        };
    },
    viewOneResponse: function (onePersonInfo) {
        const sampleUser = pick(onePersonInfo.user, ['id', 'firstName', 'lastName', 'email']);
        sampleUser.managers = distinct(onePersonInfo.managers);
        sampleUser.positions = {
            isManager: onePersonInfo.positions.includes('manager')
        };
        const isManager = onePersonInfo.positions.includes('manager');
        const isUser = onePersonInfo.positions.includes('user');
        if(isManager){
            sampleUser.positions.name = ('Manager');
        }
        if(isUser && !isManager){
            sampleUser.positions.name = ('User');
        }
        return {
            user: sampleUser
        };
    },
    deleteAllResponse: function (quantity) {
        return {
            action: "deleting Users",
            count: quantity
        };
    },
    deleteOneResponse: function (quantity) {
        return {
            action: "deleting user by id",
            count: quantity
        };
    },
    adminInfo: function () {
        return {
            registration: {
                email: 'admin@email.com',
                password: '123456',
                firstName: 'Admin',
                lastName: 'Adminov',
                group: 1337
            }
        };
    },
    viewAllManagersResponse: function (data) {
        const managersObject = {managers:[]};
        if (data.length !== 0) {
            data.map(oneManagerInfo => {
                managersObject.managers.push({
                    id: oneManagerInfo.id,
                    email: oneManagerInfo.email,
                    firstName: oneManagerInfo.firstName,
                    lastName: oneManagerInfo.lastName
                });
            })
        }
        return managersObject;
    }
};
