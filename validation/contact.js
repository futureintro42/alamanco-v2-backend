const Joi = require("@hapi/joi");
const validate = require("./validate");

const contactSchema = Joi.object({
  name: Joi.string().max(150).required().trim().label("Name"),
  email: Joi.string().email().min(3).max(150).required().trim().label("Email"),
  mobile: Joi.string().max(30).required().trim().label("Mobile"),
  subject: Joi.string().max(30).required().trim().label("Subject"),
  message: Joi.string().max(100).required().trim().label("Message"),
});

const createContact = (input) => validate(input, contactSchema);

module.exports = {
  createContact,
};
