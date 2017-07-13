const models = require('../models');
const Promise = require("bluebird");

module.exports = {
    add: function (role) {
        return models.Role.create({description: role});
    },
    createRoleForNewUser: function (user) {
        return createRole(`user_${user.id}`)
            .then(result => {
                return Promise.props({
                    createdRole: result,
                    connection: user.addRole(result)
                });
            });
    },
    findRoleById: function (roleId) {
        return models.Role.findOne({
            where: {
                id: roleId
            }
        });
    },
    findRoleByDescription: function (description) {
        return models.Role.findOne({
            where: {
                description: description
            }
        });
    },
    findRolesWithDescriptionLike: function (partDescription) {
        return models.Role.findAll({
            where: {
                description: {
                    $like: `${partDescription}%`
                }
            }
        });
    },
    getAll: function () {
        return models.Role.findAll();
    },
    addPrivilegeToRole: function (privilegeId, roleId) {
        return Promise.props({
            role: models.Role.findOne({
                where: {
                    id: roleId
                }
            }),
            privilege: models.Privilege.findOne({
                where: {
                    id: privilegeId
                }
            })
        })
            .then(result => {
                return result.role.addPrivilege(result.privilege);
            });
    },
    destroy: function (description) {
        return models.Role.destroy({
            where: {
                description: description
            }
        });
    },
    destroyAll: function () {
        return models.Role.destroy({
            where: {}
        });
    }
};
function createRole(roleDesc) {
    return models.Role.create({description: roleDesc});
}
