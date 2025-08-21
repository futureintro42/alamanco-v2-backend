const { user } = require("../../libs");

module.exports = {
  Mutation: {
    signup: (_, args) =>
      new Promise((resolve) =>
        user.signup(args?.input).then((response) => resolve(response))
      ),
    changeStatus: (_, args, context) =>
      new Promise((resolve) =>
        user
          .changeStatus(args?.input?.id, context)
          .then((response) => resolve(response))
      ),
    removeUser: (_, args, context) =>
      new Promise((resolve) =>
        user
          .removeUser(args?.input?.id, context)
          .then((response) => resolve(response))
      ),
    setPassword: (_, args) =>
      new Promise((resolve) =>
        user.setPassword(args?.input).then((response) => resolve(response))
      ),
    changePassword: (_, args, context) =>
      new Promise((resolve) =>
        user
          .changePassword(args?.input, context)
          .then((response) => resolve(response))
      ),
    updateProfile: (_, args, context) =>
      new Promise((resolve) =>
        user
          .updateProfile(args?.input, context)
          .then((response) => resolve(response))
      ),
  },
  Query: {
    login: (_, args) =>
      new Promise((resolve) =>
        user.login(args?.input).then((response) => resolve(response))
      ),
    userList: (_, args, context) =>
      new Promise((resolve) =>
        user.list(args?.input, context).then((response) => resolve(response))
      ),
    getTokenToSetPassword: (_, args) =>
      new Promise((resolve) =>
        user
          .getTokenToSetPassword(args?.input)
          .then((response) => resolve(response))
      ),
    userDetails: (_, args, context) =>
      new Promise((resolve) =>
        user.details(context, args?.input?._id).then((response) => resolve(response))
      ),
  },
};
