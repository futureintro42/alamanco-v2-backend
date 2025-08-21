const jwt = require("jsonwebtoken");

const config = require("../config/constants");

module.exports = {
  tokenValidator(token) {
    const result = { status: false, message: "Token is not valid", data: null };
    try {
      jwt.verify(token, config.secretKey, (error, decoded) => {
        if (!error && decoded) {
          result.status = true;
          result.message = "Success";
          result.data = decoded;
        }
      });
      return result;
    } catch (err) {
      return result;
    }
  },
};
