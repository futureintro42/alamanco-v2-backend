module.exports = {
  apps: [
    {
      name: "Safety",
      script: "./server.js",
      env_development: {
        NODE_ENV: "development",
        ROLES: ["ADMIN", "USER"],
        HOST: "localhost",
        PORT: 3500,
        // DB_CONNECTION: "mongodb://localhost:27017/safetydb",
        DB_CONNECTION:
          "mongodb+srv://iphtekhar:iphtekhar321@cluster0.qcujyoi.mongodb.net/new-alamanco?retryWrites=true&w=majority",
        SECERET_KEY: "anyrandomstring",
        TOKEN_EXPIRE_IN: "1d",
      },
      env_production: {
        NODE_ENV: "production",
        ROLES: ["ADMIN", "USER"],
        HOST: "localhost",
        PORT: 3600,
        DB_CONNECTION: "mongodb://0.0.0.0:27017/prodIscedb",
        SECERET_KEY: "anyrandomstring",
        TOKEN_EXPIRE_IN: "1d",
      },
    },
  ],
};
