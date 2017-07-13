const bcrypt = require('bcrypt');
const saltRounds = 10;
const Promise = require("bluebird");

module.exports = {
    hashPassword: function (password) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, function (err, hash) {
                if (err) {
                    reject(err);
                } else {
                    resolve(hash);
                }
            });
        });
    },
    verifyPassword: function (possiblePwd, hash) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(possiblePwd, hash, function (err, equal) {
                if (err) {
                    reject(err);
                }
                resolve(equal);
            });
        });
    },
};
