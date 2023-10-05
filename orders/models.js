const mongoose = require('mongoose');

const { ProductsSchema } = require('../products/model');

const ordersSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    // переробити на масив продуктів
    products: [ProductsSchema],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const ordersModule = mongoose.model('Order', ordersSchema);
module.exports = ordersModule;
