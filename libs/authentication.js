const commonActions = require("./common");
const User = require("../models/User");

module.exports = {
  auth(context) {
    return new Promise(async (resolve) => {
      if (context.user) {
        const { error, data } = await commonActions.findByAttribute(
          { id: parseInt(context.user.id) },
          User
        );
        if (error || !data) {
          return resolve({ status: false, response: null });
        } else {
          return resolve({
            status: true,
            response: {
              name: `${data.first_name} ${data.last_name}`,
              role: data.role?.toLowerCase(),
              status: data.status?.toLowerCase(),
            },
          });
        }
      } else {
        return resolve({ status: false, response: null });
      }
    });
  },
  fetchUserType(context) {
    return new Promise(async (resolve) => {
      if (context.user) {
        const { error, data } = await commonActions.findByAttribute(
          { id: parseInt(context.user.id) },
          User
        );
        if (error || !data) {
          return resolve({ type: null });
        } else {
          return resolve({ type: data.role.toLowerCase() });
        }
      } else {
        return resolve({ type: null });
      }
    });
  },
};
