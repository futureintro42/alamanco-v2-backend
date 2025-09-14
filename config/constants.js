module.exports = {
  roles: process.env.ROLES,
  secretKey: process.env.SECERET_KEY,
  expiresIn: process.env.TOKEN_EXPIRE_IN,
  // File upload convention
  filenameConvention: {
    length: 4,
    charset: "alphabetic",
    capitalization: "lowercase",
  },
  autoIncrementInitial: {
    userID: 1100,
    cardID: 5000,
    certificateID: 10000,
  },
};
