const models = require('../models');

module.exports = {
    add: function (ruleType) {
        return models.RuleType.create({description: ruleType});
    },
    findRuleByDescription: function (ruleType) {
        return models.RuleType.findOne({
            where: {
                description: ruleType
            }
        });
    },
    destroy: function (ruleType) {
        return models.RuleType.destroy({
            where: {
                description: ruleType
            }
        });
    },
    destroyAll: function () {
        return models.RuleType.destroy({
            where: {}
        });
    }
};
