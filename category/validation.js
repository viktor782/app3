const Order = require('./router');
const joi = require('joi');
// Валідація даних з використанням схеми Joi

const SchemaValidation = joi.object({
    products: joi.string().required(),
});

module.export = SchemaValidation;
