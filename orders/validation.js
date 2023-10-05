const joi = require('joi');
const { validate } = require('../category/model');

const { error } = ordersSchema.validate(req.body);
if (error) {
    return res.status(400).json({ error: error.details[0].message });
}

const { name } = req.body;

module.exports = validate;
