const jwt = require("jsonwebtoken");

const createNewToken = (payload) => {
    return jwt.sign({ userId: payload }, "$%%$^&%&^%*&^%*&^%(^%", { expiresIn: '10d' });
}

module.exports = { createNewToken }