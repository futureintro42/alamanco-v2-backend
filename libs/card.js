const moment = require("moment");
const randomstring = require("randomstring");
const isBase64 = require("is-base64");

const Card = require("../models/Card");
const commonFunc = require("./common");
const config = require("../config/constants");
const auth = require("./authentication");
const fileUpload = require("./fileUpload");
const joi = require("../validation/card");

module.exports = {
  createUpdateCard(input, context) {
    return new Promise(async (resolve) => {
      try {
        const { type } = await auth.fetchUserType(context);
        if (type === "admin" || type === "user") {
          const userId = parseInt(context.user.id);
          const validation = joi.createUpdate(input);
          if (validation.error) {
            return resolve({
              error: validation.error,
              severity: "error",
              message: "Please fix fields in red below.",
            });
          } else {
            const {
              _id = "",
              name,
              iqama_number,
              certified_as,
              company,
              examiner,
              profile_pic = "",
            } = validation.value;
            const now = moment(new Date()).format("YYYY-MM-DD");
            const issue_date = moment(validation.value.issue_date).format(
              "YYYY-MM-DD"
            );
            const expiry_date = moment(validation.value.expiry_date).format(
              "YYYY-MM-DD"
            );
            const prepareInput = {
              name,
              iqama_number,
              certified_as,
              issue_date,
              expiry_date,
              profile_pic,
              company,
              examiner,
              createdAt: now,
              updateddAt: now,
            };
            // Inject image
            if (isBase64(prepareInput.profile_pic, { mimeRequired: true })) {
              const filenameWithoutExt = randomstring.generate({
                ...config.filenameConvention,
                length: 8,
              });
              const { filename } = await fileUpload.uploadImage(
                prepareInput.profile_pic,
                "public/images/profile",
                filenameWithoutExt
              );
              if (filename) {
                prepareInput.profile_pic = filename;
              } else {
                prepareInput.profile_pic = "";
              }
            }

            if (_id) {
              // Update the record
              const { error } = commonFunc.findOneAndUpdate(
                { _id },
                prepareInput,
                Card
              );
              if (error) {
                return resolve({
                  error: null,
                  severity: "error",
                  message: "Something went wrong while updating record!",
                });
              } else {
                return resolve({
                  error: null,
                  severity: "success",
                  message: "Record has been updated successfully.",
                });
              }
            } else {
              // Insert the record
              return new Card({
                ...prepareInput,
                fk_user_id: userId,
                status: "ACTIVE",
              })
                .save()
                .then((response) =>
                  resolve({
                    error: null,
                    severity: response ? "success" : "error",
                    message: response
                      ? "Card has been created successfully"
                      : "Something went wrong while creating card.",
                  })
                )
                .catch((error) => {
                  console.error("error:", error);
                  return resolve({
                    error: null,
                    severity: "error",
                    message: "Something went wrong!",
                  });
                });
            }
          }
        } else {
          return resolve({
            error: null,
            severity: "error",
            message: "Request is not allowed!",
          });
        }
      } catch (ex) {
        return resolve({
          error: null,
          severity: "error",
          message: "Something went wrong!",
        });
      }
    });
  },
  findCardByID(_id) {
    return new Promise(async (resolve) => {
      try {
        if (commonFunc.isValidObjectId(_id)) {
          const { error, data } = await commonFunc.findByAttribute(
            { _id },
            Card
          );

          if (error || !data) {
            return resolve({
              severity: "error",
              message: "Sorry, Record does not exist.",
              response: null,
            });
          } else {
            return resolve({
              severity: "",
              message: "",
              response: {
                ...data._doc,
                issue_date: moment(data.issue_date).format("YYYY-MM-DD"),
                expiry_date: moment(data.expiry_date).format("YYYY-MM-DD"),
                createdAt: moment(data.createdAt).format("YYYY-MM-DD"),
                updateddAt: moment(data.updateddAt).format("YYYY-MM-DD"),
              },
            });
          }
        } else {
          return resolve({
            severity: "error",
            message: "Sorry, Record does not exist.",
            response: null,
          });
        }
      } catch (error) {
        console.error(error);
        return resolve({
          severity: "error",
          message: "Something went wrong!",
          response: null,
        });
      }
    });
  },
  list(context) {
    return new Promise(async (resolve) => {
      const { type } = await auth.fetchUserType(context);
      if (type === "admin" || type === "user") {
        const match = {
          id: type === "user" ? { $eq: context.user.id } : { $ne: 0 },
        };
        const project = {
          _id: "$_id",
          id: "$id",
          profile_pic: "$profile_pic",
          name: "$name",
          iqama_number: "$iqama_number",
          status: "$status",
          issue_date: {
            $dateToString: { format: "%Y-%m-%d", date: "$issue_date" },
          },
          expiry_date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$expiry_date",
            },
          },
          certified_as: "$certified_as",
          createdAt: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          updateddAt: {
            $dateToString: { format: "%Y-%m-%d", date: "$updateddAt" },
          },
        };
        const sort = {
          id: 1,
        };

        const addFields = {
          action: {
            changeStatus: type === "admin" ? true : false,
            view: true,
            edit: type === "admin" ? true : false,
            remove: type === "admin" ? true : false,
          },
        };

        const { response } = await commonFunc.queryExecutor(
          { match, project, sort, addFields },
          Card
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
      if (type === "admin" || type === "user") {
        const { data } = await commonFunc.findByAttribute(
          { id: parseInt(id) },
          Card
        );
        if (data) {
          const status = data.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
          const updateRes = await commonFunc.updateByAttributes(
            { id: parseInt(id) },
            { status },
            Card
          );
          if (!updateRes.error && updateRes.data) {
            response.hasError = false;
            response.message = "Status changed successfully.";
            response.severity = "success";
          }
        }
      } else {
        response.message =
          "Please contact to administrator for updating status.";
      }
      return resolve(response);
    });
  },
  removeCard(_id, context) {
    return new Promise(async (resolve) => {
      const response = {
        hasError: true,
        message: "Something went wrong.",
        severity: "error",
      };
      const { type } = await auth.fetchUserType(context);
      if (type === "admin") {
        const { error } = await commonFunc.findAndDelete({ _id }, Card);
        if (!error) {
          response.hasError = false;
          response.message = "Card has been deleted successfully.";
          response.severity = "success";
        }
      }
      return resolve(response);
    });
  },
};
