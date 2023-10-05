const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
        required: false,
    },
});

const ProductsModel = mongoose.model('Products', ProductsSchema);

module.exports = { ProductsModel, ProductsSchema };
