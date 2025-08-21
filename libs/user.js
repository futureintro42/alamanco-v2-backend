const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
const isBase64 = require("is-base64");

const User = require("../models/User");
const joi = require("../validation/user");
const commonFunc = require("./common");
const config = require("../config/constants");
const auth = require("./authentication");
const fileUpload = require("./fileUpload");

module.exports = {
  signup(input) {
    return new Promise(async (resolve) => {
      try {
        const validation = joi.signup(input);
        if (validation.error) {
          return resolve({
            error: validation.error,
            severity: "error",
            message: "Please fix fields in red below.",
          });
        } else {
          const { first_name, last_name, email, password, role } =
            validation.value;
          const now = moment(new Date()).format("YYYY-MM-DD");
          const prepareInput = {
            first_name,
            last_name,
            email,
            role,
            forgotPasswordToken: "",
            status: "INACTIVE",
            createdAt: now,
            updateddAt: now,
          };
          const newUser = new User(prepareInput);
          newUser.hasPassword = bcrypt.hashSync(password, 10);
          return newUser
            .save()
            .then((response) =>
              resolve({
                error: null,
                severity: response ? "success" : "error",
                message: response
                  ? "Your account has been created successfully"
                  : "Something went wrong while creating account.",
              })
            )
            .catch((error) => {
              if (error) {
                if (error.code && error.code === 11000) {
                  return resolve({
                    error: [
                      {
                        key: "email",
                        value: "Already in used!",
                      },
                    ],
                    severity: "error",
                    message: "Please fix fields in red below.",
                  });
                } else {
                  return resolve({
                    error: null,
                    severity: "error",
                    message: "Something went wrong!",
                  });
                }
              } else {
                return resolve({
                  error: null,
                  severity: "error",
                  message: "Something went wrong!",
                });
              }
            });
        }
      } catch (ex) {
        console.error(ex);
        return resolve({
          error: null,
          severity: "error",
          message: "Something went wrong!",
        });
      }
    });
  },
  login(input) {
    return new Promise(async (resolve) => {
      try {
        const validation = joi.login(input);
        if (validation.error) {
          return resolve({
            error: validation.error,
            severity: "error",
            message: "Please fix fields in red below.",
            response: null,
            token: "",
          });
        } else {
          const { email, password } = validation.value;
          const { error, data } = await commonFunc.findByAttribute(
            { email },
            User
          );
          if (error || !data) {
            return resolve({
              error: null,
              severity: "error",
              message: "Authentication failed, No user found.",
              response: null,
              token: "",
            });
          } else {
            if (data) {
              if (!data.comparePassword(password, data.hasPassword)) {
                return resolve({
                  error: null,
                  severity: "error",
                  message: "Authentication failed, wrong password.",
                  response: null,
                  token: "",
                });
              } else if (data.status === "INACTIVE") {
                return resolve({
                  error: null,
                  severity: "error",
                  message:
                    "Your profile is inactive. Please contact to administrator.",
                  response: null,
                  token: "",
                });
              } else {
                return resolve({
                  error: null,
                  severity: "success",
                  message: "Logged In successfully.",
                  response: {
                    name: `${data.first_name} ${data.last_name}`,
                    role: data.role.toLowerCase(),
                    status: data.status.toLowerCase(),
                  },
                  token: jwt.sign({ id: parseInt(data.id) }, config.secretKey),
                });
              }
            } else {
              return resolve({
                error: null,
                severity: "error",
                message: "Authentication failed, No user found.",
                response: null,
                token: "",
              });
            }
          }
        }
      } catch (ex) {
        console.error(ex);
        return resolve({
          error: null,
          severity: "error",
          message: "Authentication failed.",
          response: null,
          token: "",
        });
      }
    });
  },
  list(input, context) {
    return new Promise(async (resolve) => {
      const { type } = await auth.fetchUserType(context);
      if (type === "admin") {
        const {
          search: { status = "" },
        } = input;

        const match = {
          id: { $ne: context.user.id },
          status: status
            ? { $regex: `^${status}`, $options: "i" }
            : { $ne: "" },
        };
        const project = {
          _id: "$_id",
          id: "$id",
          profile_pic: "$profile_pic",
          first_name: "$first_name",
          last_name: "$last_name",
          email: "$email",
          role: "$role",
          status: "$status",
        };
        const sort = {
          id: -1,
        };

        const addFields = {
          action: {
            view: true,
            edit: false,
            changeStatus: true,
            remove: false,
          },
        };
        const { response } = await commonFunc.queryExecutor(
          { match, project, sort, addFields },
          User
        );
        return resolve({ response });
      } else {
        return resolve({ response: [] });
      }
    });
  },
  changeStatus(id, context) {
    return new Promise(async (resolve) => {
      const response = {
        hasError: true,
        message: "Something went wrong.",
        severity: "error",
      };
      const { type } = await auth.fetchUserType(context);
      if (type === "admin") {
        const { data } = await commonFunc.findByAttribute(
          { id: parseInt(id) },
          User
        );
        if (data) {
          const status = data.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
          const updateRes = await commonFunc.updateByAttributes(
            { id: parseInt(id) },
            { status },
            User
          );
          if (!updateRes.error && updateRes.data) {
            response.hasError = false;
            response.message = "Status changed successfully.";
            response.severity = "success";
          }
        }
      }
      return resolve(response);
    });
  },
  removeUser(id, context) {
    return new Promise(async (resolve) => {
      const response = {
        hasError: true,
        message: "Something went wrong.",
        severity: "error",
      };
      const { type } = await auth.fetchUserType(context);
      if (type === "admin") {
        const { error } = await commonFunc.findAndDelete(
          { id: parseInt(id) },
          User
        );
        if (!error) {
          response.hasError = false;
          response.message = "User deleted successfully.";
          response.severity = "success";
        }
      }
      return resolve(response);
    });
  },
  getTokenToSetPassword(input) {
    return new Promise(async (resolve) => {
      try {
        const validation = joi.email(input);
        if (validation.error) {
          return resolve({
            error: validation.error,
            token: "",
            severity: "error",
            message: "Please fix fields in red below.",
          });
        } else {
          const { email } = validation.value;
          const code = randomstring.generate(32);
          const datetime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
          const { error, data } = await commonFunc.findByAttribute(
            { email },
            User
          );
          if (!error && data) {
            const updateRes = await commonFunc.updateByAttributes(
              { email },
              { forgotPasswordToken: code, updatedAt: datetime },
              User
            );
            if (!updateRes.error && updateRes.data) {
              return resolve({
                error: null,
                token: code,
                severity: "success",
                message: "Account has been verified.",
              });
            } else {
              return resolve({
                error: null,
                token: "",
                severity: "error",
                message: "Something went wrong!",
              });
            }
          } else {
            return resolve({
              error: null,
              token: "",
              severity: "error",
              message: "Account does not exist!",
            });
          }
        }
      } catch (ex) {
        console.error(ex);
        return resolve({
          error: null,
          token: "",
          severity: "error",
          message: "Something went wrong!",
        });
      }
    });
  },
  setPassword(input) {
    return new Promise(async (resolve) => {
      try {
        const validation = joi.setPassword(input);
        if (validation.error)
          return resolve({
            error: validation.error,
            message: "Please fix fields in red below.",
            severity: "error",
          });
        const { token, password } = validation.value;
        const { error, data } = await commonFunc.validateToken(token, User);
        if (!error && data) {
          const datetime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

          const { error: err } = await commonFunc.updateByAttributes(
            { _id: data._id },
            {
              hasPassword: bcrypt.hashSync(password, 10),
              forgotPasswordToken: "",
              updateddAt: datetime,
            },
            User
          );
          if (err) {
            return resolve({
              error: [
                { key: "password", value: "" },
                { key: "confirmPassword", value: "" },
              ],
              message: "Some thing went wrong!",
              severity: "error",
            });
          } else {
            return resolve({
              error: null,
              message: "Password has been set successfully",
              severity: "success",
            });
          }
        } else {
          return resolve({
            error: null,
            message: "Token is invalid",
            severity: "error",
          });
        }
      } catch (ex) {
        console.error(ex);
        return resolve({
          error: null,
          message: "Token is invalid",
          severity: "error",
        });
      }
    });
  },
  changePassword(input, context) {
    return new Promise(async (resolve) => {
      try {
        const validation = joi.changePassword(input);
        if (validation.error) {
          return resolve({
            error: validation.error,
            message: "Please fix fields in red below.",
            severity: "error",
          });
        } else {
          const { error, data } = await commonFunc.findByAttribute(
            {
              id: parseInt(context.user.id),
            },
            User
          );
          if (error) {
            return resolve({
              error: null,
              message: "Something went wrong! while fetching record.",
              severity: "error",
            });
          }
          if (!error && data) {
            const { oldPassword, password } = validation.value;
            if (data.comparePassword(oldPassword, data.hasPassword)) {
              const { error: err } = await commonFunc.updateByAttributes(
                { id: parseInt(data.id) },
                {
                  hasPassword: bcrypt.hashSync(password, 10),
                  updatedAt: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                },
                User
              );
              if (err) {
                return resolve({
                  error: [
                    { key: "oldPassword", value: "" },
                    { key: "password", value: "" },
                    { key: "confirmPassword", value: "" },
                  ],
                  message: "Some thing went wrong! while updating record.",
                  severity: "error",
                });
              } else {
                return resolve({
                  error: null,
                  message: "Password has been updated successfully",
                  severity: "success",
                });
              }
            } else {
              return resolve({
                error: null,
                message: "Mismatch your old password!",
                severity: "error",
              });
            }
          } else {
            return resolve({
              error: null,
              message: "Something went wrong! while fetching record.",
              severity: "error bg",
            });
          }
        }
      } catch (ex) {
        console.error(ex);
        return resolve({
          error: null,
          message: "Something went wrong!",
          severity: "error bg",
        });
      }
    });
  },
  updateProfile(input, context) {
    return new Promise(async (resolve) => {
      try {
        const validation = joi.updateProfile(input);
        if (validation.error) {
          return resolve({
            error: validation.error,
            severity: "error",
            message: "Please fix fields in red below.",
          });
        } else {
          const { type } = await auth.fetchUserType(context);
          if (type === "admin" || type === "user") {
            const match = {};
            if (validation.value._id) {
              match._id = commonFunc.isValidObjectId(validation.value._id)
                ? validation.value._id
                : null;
            } else {
              match.id = parseInt(context.user.id);
            }
            const inputPrepare = {
              first_name: validation.value.first_name,
              last_name: validation.value.last_name,
              role: validation.value.role,
              profile_pic: validation.value.profile_pic,
            };
            // Inject image
            if (isBase64(inputPrepare.profile_pic, { mimeRequired: true })) {
              const filenameWithoutExt = randomstring.generate({
                ...config.filenameConvention,
                length: 8,
              });
              const { filename } = await fileUpload.uploadImage(
                inputPrepare.profile_pic,
                "public/images/profile",
                filenameWithoutExt
              );
              if (filename) {
                inputPrepare.profile_pic = filename;
              } else {
                inputPrepare.profile_pic = "";
              }
            }

            const { error } = await commonFunc.updateByAttributes(
              match,
              {
                ...inputPrepare,
                updatedAt: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
              },
              User
            );
            if (error) {
              return resolve({
                error: null,
                severity: "error",
                message: "Something went wrong while updating record.",
              });
            } else {
              return resolve({
                error: null,
                severity: "success",
                message: "Record has been updated successfully.",
              });
            }
          } else {
            return resolve({
              error: null,
              severity: "error",
              message: "Sorry, you are not authorized.",
            });
          }
        }
      } catch (ex) {
        console.error(ex);
        return resolve({
          error: null,
          severity: "error",
          message: "Something went wrong!",
        });
      }
    });
  },
  details(context, _id = "") {
    let response = null;
    return new Promise(async (resolve) => {
      try {
        const { type } = await auth.fetchUserType(context);
        if (type === "admin" || type === "user") {
          const match = {};
          if (_id) {
            match._id = commonFunc.isValidObjectId(_id) ? _id : null;
          } else {
            match.id = parseInt(context.user.id);
          }
          const { data } = await commonFunc.findByAttribute(match, User);
          if (data) {
            response = {
              _id: data._id,
              id: data.id,
              first_name: data.first_name,
              last_name: data.last_name,
              email: data.email,
              role: data.role,
              status: data.status,
              profile_pic: data.profile_pic,
            };
          }
        }
        return resolve({ response });
      } catch (ex) {
        console.error(ex);
        return resolve(response);
      }
    });
  },
};
