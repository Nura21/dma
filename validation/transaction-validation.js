const Joi = require("joi");

const transactionValidation = Joi.object({
  total_price: Joi.required(),
  product_item: Joi.required(),
  received: Joi.required(),
  change_received: Joi.string().allow(''),
  created_at: Joi.string().allow(''), // Add the "created_at" field to the validation schema
  updated_at: Joi.string().allow('') // Add the "created_at" field to the validation schema
});


module.exports = {
  transactionValidation
};
