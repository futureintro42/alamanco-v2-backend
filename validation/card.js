const Joi = require("@hapi/joi");
const validate = require("./validate");

const cardSchema = Joi.object({
  _id: Joi.string().allow("").optional().label("Resource ID"),
  name: Joi.string().max(150).required().trim().label("Name"),
  iqama_number: Joi.string().max(100).required().trim().label("Iqama number"),
  issue_date: Joi.string().max(30).required().trim().label("Issue date"),
  expiry_date: Joi.string().max(30).required().trim().label("Expiry date"),
  certified_as: Joi.string().max(100).required().trim().label("Certified as"),
  company: Joi.string().max(100).required().trim().label("Company"),
  examiner: Joi.string().max(100).required().trim().label("Examiner"),
  profile_pic: Joi.string().allow("").optional().label("Profile pic"),
});

const createUpdate = (input) => validate(input, cardSchema);

module.exports = {
  createUpdate,
};
