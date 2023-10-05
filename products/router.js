const express = require('express');
const router = express.Router();
const { ProductsModel } = require('./model');
const service = require('./service');

// створення (create) нового продукта
router.post('/', async (req, res) => {
    const { name, description, price, category, image } = req.body;
    const newProduct = new ProductsModel({
        name,
        description,
        price,
        category,
        image,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
});

router.get('/:id', async (req, res) => {
    const productId = req.params.id;

    const product = await ProductsModel.findById(productId)
        .populate('category')
        .populate('image')
        .exec();
    res.status(200).json(product);
});
router.get('/', async (req, res) => {
    const { category, productName, minPrice, maxPrice } = req.query;

    const filters = {};
    if (category) {
        filters['category.name'] = category;
    }
    if (productName) {
        filters['name'] = { $regex: productName, $options: 'i' };
    }

    if (minPrice && maxPrice) {
        filters['price'] = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
        filters['price'] = { $gte: minPrice };
    } else if (maxPrice) {
        filters['price'] = { $lte: maxPrice };
    }
    const products = await ProductsModel.find(filters)
        .populate('category')
        .populate('image');

    if (products.length > 0) {
        res.json(products);
    } else {
        res.status(404).json({ message: 'Продукти не знайдено' });
    }
});

// Оновлення (Create) продукта за id
router.put('/:id', async (req, res) => {
    const productId = req.params.id;
    const { name, description, category } = req.body;

    Product.findByIdAndUpdate(
        productId,
        { name, description, category },
        { new: true }
    );
    if (updatedProduct) {
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Продукт не знайдено' });
    }
});

// видалення (delete) продукта за id
router.delete('/:id', async (req, res) => {
    const productId = req.params.id;

    const deletedProduct = await ProductsModel.findByIdAndRemove(productId);

    if (deletedProduct) {
        res.json({ message: 'Продукт видалено' });
    } else {
        res.status(404).json({ message: 'Продукт не знайдено' });
    }
});

module.exports = router;
