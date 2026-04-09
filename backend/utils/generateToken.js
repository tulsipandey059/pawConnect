const jwt = require("jsonwebtoken");

const getJwtSecret = () => process.env.JWT_SECRET || "secret123";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

module.exports = generateToken;
module.exports.getJwtSecret = getJwtSecret;
