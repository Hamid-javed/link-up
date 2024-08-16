const crypto = require("crypto")

const SECRET_TOKEN = crypto.randomBytes(64).toString('hex')


module.exports = {
    SECRET_TOKEN: SECRET_TOKEN
};