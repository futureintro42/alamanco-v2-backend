const Joi = require("@hapi/joi");
const validate = require("./validate");

const signupSchema = Joi.object({
  first_name: Joi.string()
    .min(3)
    .max(150)
    .required()
    .trim()
    .label("First name"),
  last_name: Joi.string().min(3).max(150).required().trim().label("Last name"),
  email: Joi.string().email().min(3).max(150).required().trim().label("Email"),
  password: Joi.string().min(6).max(18).required().trim().label("Password"),
  confirmPassword: Joi.string()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .options({ messages: { "any.only": "{{#label}} does not match" } }),
  role: Joi.string()
    .valid("ADMIN", "USER")
    .required()
    .label("User Type")
    .options({
      messages: {
        "any.only": `{{#label}} does not match. Please use from this list [ADMIN, USER] accordingly.`,
      },
    }),
});
const loginSchema = Joi.object({
  email: Joi.string().email().min(3).max(150).required().trim().label("Email"),
  password: Joi.string().min(6).max(18).required().trim().label("Password"),
});
const emailSchema = Joi.object({
  email: Joi.string().email().min(3).max(150).required().trim().label("Email"),
});
const setPasswordSchema = Joi.object({
  token: Joi.string().max(32).required().trim().label("Token"),
  password: Joi.string().min(6).max(18).required().trim().label("Password"),
  confirmPassword: Joi.string()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .options({ messages: { "any.only": "{{#label}} does not match" } }),
});
const validateTokenSchema = Joi.object({
  token: Joi.string().max(32).required().trim().label("Activation Token"),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string()
    .min(6)
    .max(18)
    .required()
    .trim()
    .label("Old Password"),
  password: Joi.string().min(6).max(18).required().trim().label("Password"),
  confirmPassword: Joi.string()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .options({ messages: { "any.only": "{{#label}} does not match" } }),
});

const updateProfileSchema = Joi.object({
  _id: Joi.string().allow("").optional().label("Resource ID"),
  first_name: Joi.string()
    .min(3)
    .max(150)
    .required()
    .trim()
    .label("First name"),
  last_name: Joi.string().min(3).max(150).required().trim().label("Last name"),
  role: Joi.string().required().trim().label("Role"),
  profile_pic: Joi.string().allow("").optional().label("Profile Pic"),
});

const signup = (input) => validate(input, signupSchema);
const login = (input) => validate(input, loginSchema);
const email = (input) => validate(input, emailSchema);
const setPassword = (input) => validate(input, setPasswordSchema);
const validateToken = (input) => validate(input, validateTokenSchema);
const changePassword = (input) => validate(input, changePasswordSchema);
const updateProfile = (input) => validate(input, updateProfileSchema);

module.exports = {
  signup,
  login,
  email,
  setPassword,
  validateToken,
  changePassword,
  updateProfile
};
