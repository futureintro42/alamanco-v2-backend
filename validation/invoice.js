const Joi = require("@hapi/joi");
const validate = require("./validate");

const invoiceSchema = Joi.object({
  _id: Joi.string().allow("").optional().label("Resource ID"),
  sticker_number: Joi.string()
    .max(30)
    .required()
    .trim()
    .label("Sticker number"),
  reference_number: Joi.string()
    .max(30)
    .required()
    .trim()
    .label("Reference number"),
  equipment_type: Joi.string()
    .max(30)
    .required()
    .trim()
    .label("Equipment type"),
  equipment_description: Joi.string()
    .max(200)
    .required()
    .trim()
    .label("Equipment description"),
  make: Joi.string().max(150).required().trim().label("Make"),
  serial_number: Joi.string().max(100).required().trim().label("Serial number"),
  year_of_manufacturing: Joi.string()
    .max(30)
    .required()
    .trim()
    .label("Year of manufacturing"),
  plant_number: Joi.string().max(100).required().trim().label("Plant number"),
  location_of_equipment: Joi.string().max(30).required().trim().label("Location of equipment"),
  owner_business_name: Joi.string()
    .max(150)
    .required()
    .trim()
    .label("Owner business name"),
  owner_business_address: Joi.string()
    .max(200)
    .required()
    .trim()
    .label("Owner business address"),
  details: Joi.string().max(200).required().trim().label("Details"),
  standard_specification: Joi.string()
    .max(200)
    .required()
    .trim()
    .label("Standard specification"),
  business_name: Joi.string().max(100).required().trim().label("Business name"),
  business_address: Joi.string()
    .max(200)
    .required()
    .trim()
    .label("Business address"),
  inspection_date: Joi.string()
    .max(30)
    .required()
    .trim()
    .label("Inspection date"),
  inspection_next_date: Joi.string()
    .max(30)
    .required()
    .trim()
    .label("Inspection next date"),
  inspector_name: Joi.string()
    .max(100)
    .required()
    .trim()
    .label("Inspector name"),
    resultStatus: Joi.string()
    .required()
    .trim()
    .label("Result status"),
});

const invoice = (input) => validate(input, invoiceSchema);

module.exports = {
  invoice,
};
