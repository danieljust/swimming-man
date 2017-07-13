module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            unique: {
                msg: 'User with this email already registered'
            },
            allowNull: false,
            validate: {
                isEmail: {
                    msg: "Provided string is not a valid email"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        }
    }, {
        classMethods: {
            associate: function (models) {
                User.hasMany(models.Training, {foreignKey: 'userId'});
                User.hasMany(models.Grant, {foreignKey: 'userId'});
                User.belongsToMany(models.Role, {through: 'UserRole', foreignKey: 'userId'});
            }
        },
        timestamps: false
    });
    return User;
};
