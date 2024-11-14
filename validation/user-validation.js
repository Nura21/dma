const Joi = require("joi");

const registerUserValidation = Joi.object({
  name: Joi.string().max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().max(100).required(),
  created_at: Joi.date().required(),
});

const loginUserValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().max(100).required(),
});

module.exports = {
  registerUserValidation,
  loginUserValidation,
};
