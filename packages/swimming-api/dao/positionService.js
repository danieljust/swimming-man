const models = require('../models');
const Promise = require("bluebird");

module.exports = {
    add: function (positionDesc) {
        return models.Position.create({description: positionDesc});
    },
    findById: function (id) {
        return models.Position.findOne({
            where: {
                id: id
            }
        });
    },
    findByDescription: function (description) {
        return models.Position.findOne({
            where: {
                description: description
            }
        });
    },
    getAll: function () {
        return models.Position.findAll();
    },
    destroy: function (description) {
        return models.Position.destroy({
            where: {
                description: description
            }
        });
    },
    destroyAll: function () {
        return models.Position.destroy({
            where: {}
        });
    },
    extractFromRole: function (role) {
        return role.description.substr(0, role.description.indexOf('_'));
    }
};
