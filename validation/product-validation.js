const Joi = require("joi");

const productValidation = Joi.object({
  name: Joi.string().max(100).required(),
  image: Joi.allow(''),
  description: Joi.string().required(),
  price: Joi.required(),
  status: Joi.string().required(),
  created_at: Joi.string().allow(''), // Add the "created_at" field to the validation schema
  updated_at: Joi.string().allow(''), // Add the "created_at" field to the validation schema
  id: Joi.allow('')
});


module.exports = {
  productValidation,
};
