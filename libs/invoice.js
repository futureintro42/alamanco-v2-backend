const moment = require("moment");
const User = require("../models/User");
const Invoice = require("../models/Invoice");
const joi = require("../validation/invoice");
const commonFunc = require("./common");
const auth = require("./authentication");

module.exports = {
  createUpdateInvoice(input, context) {
    return new Promise(async (resolve) => {
      try {
        const { type } = await auth.fetchUserType(context);
        if (type === "user" || type === "admin") {
          const userId = parseInt(context.user.id);
          const validation = joi.invoice(input);
          if (validation.error) {
            return resolve({
              error: validation.error,
              severity: "error",
              message: "Please fix fields in red below.",
            });
          } else {
            const { _id, inspection_date, inspection_next_date, ...rest } =
              validation.value;
            const now = moment(new Date()).format("YYYY-MM-DD");
            const prepareInput = {
              ...rest,
              updatedBy: userId,
              inspection_date: moment(inspection_date).format("YYYY-MM-DD"),
              inspection_next_date:
                moment(inspection_next_date).format("YYYY-MM-DD"),
              updateddAt: now,
            };
            if (_id) {
              // Update the record
              const { error } = commonFunc.findOneAndUpdate(
                { _id },
                { ...prepareInput },
                Invoice
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
              return new Invoice({
                ...prepareInput,
                status: "ACTIVE",
                fk_user_id: userId,
                createdBy: userId,
                createdAt: now,
              })
                .save()
                .then((response) =>
                  resolve({
                    error: null,
                    severity: response ? "success" : "error",
                    message: response
                      ? "Invoice has been created successfully"
                      : "Something went wrong while creating invoice.",
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
            message: "Something went wrong!",
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
  findByID(_id) {
    return new Promise(async (resolve) => {
      try {
        if (commonFunc.isValidObjectId(_id)) {
          const { error, data } = await commonFunc.findByAttribute(
            { _id },
            Invoice
          );

          if (error || !data) {
            return resolve({
              severity: "error",
              message: "Sorry, Record does not exist.",
              response: null,
            });
          } else {
            const userRes = await commonFunc.findByAttribute(
              { id: parseInt(data.fk_user_id) },
              User
            );
            const user = `${
              !userRes.error && userRes.data
                ? userRes.data.first_name + " " + userRes.data.last_name
                : ""
            }`;
            return resolve({
              severity: "",
              message: "",
              response: {
                ...data._doc,
                inspection_date: moment(data.inspection_date).format(
                  "YYYY-MM-DD"
                ),
                inspection_next_date: moment(data.inspection_next_date).format(
                  "YYYY-MM-DD"
                ),
                createdAt: moment(data.createdAt).format("YYYY-MM-DD"),
                updatedAt: moment(data.updateddAt).format("YYYY-MM-DD"),
                user,
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
          fk_user_id: type === "user" ? { $eq: context.user.id } : { $ne: 0 },
        };
        const lookup = {
          from: "users",
          localField: "fk_user_id",
          foreignField: "id",
          as: "user",
        };
        const unwind = "$user";
        const project = {
          _id: "$_id",
          id: "$id",
          user: {
            $concat: ["$user.first_name", " ", "$user.last_name"],
          },
          sticker_number: "$sticker_number",
          reference_number: "$reference_number",
          equipment_type: "$equipment_type",
          equipment_description: "$equipment_description",
          make: "$make",
          serial_number: "$serial_number",
          year_of_manufacturing: "$year_of_manufacturing",
          plant_number: "$plant_number",
          location_of_equipment: "$location_of_equipment",
          owner_business_name: "$owner_business_name",
          owner_business_address: "$owner_business_address",
          details: "$details",
          standard_specification: "$standard_specification",
          business_name: "$business_name",
          business_address: "$business_address",
          resultStatus: "$resultStatus",
          status: "$status",
          inspection_date: {
            $dateToString: { format: "%Y-%m-%d", date: "$inspection_date" },
          },
          inspection_next_date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$inspection_next_date",
            },
          },
          inspector_name: "$inspector_name",
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
            edit: true,
            remove: type === "admin" ? true : false,
          },
        };

        const { response } = await commonFunc.queryExecutor(
          { match, project, lookup, unwind, sort, addFields },
          Invoice
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
          Invoice
        );
        if (data) {
          const status = data.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
          const updateRes = await commonFunc.updateByAttributes(
            { id: parseInt(id) },
            { status },
            Invoice
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
  removeInvoice(_id, context) {
    return new Promise(async (resolve) => {
      const response = {
        hasError: true,
        message: "Something went wrong.",
        severity: "error",
      };
      const { type } = await auth.fetchUserType(context);
      if (type === "admin") {
        const { error } = await commonFunc.findAndDelete({ _id }, Invoice);
        if (!error) {
          response.hasError = false;
          response.message = "Certificate has been deleted successfully.";
          response.severity = "success";
        }
      }
      return resolve(response);
    });
  },
};
