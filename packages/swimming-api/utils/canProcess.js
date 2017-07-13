const privilegeService = require('../dao/privilegeService');

module.exports = {
    canProcessOne: function (userId, entityId, action, entityType) {
        return privilegeService.canProcess(userId, entityId, action, entityType);
    }
};
