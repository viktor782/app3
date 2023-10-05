const express = require('express');
const router = express.Router();
const Category = require('./model');
const joi = require('joi');
const category = require('./validation');
const CategoryService = require('./service');
const categoryService = new CategoryService();

router.get('/', async (req, res) => {
    const categorys = await Category.find(); // Використовуємо .populate()
    res.json(categorys);
});

router.post('/', async (req, res) => {
    const { name } = req.body;
    const productSchema = joi.object({
        name: joi.string().required(),
    });

    // Перевірка чи категорія існує перед вставкою
    const productCategory = await Category.findOne({ name });
    if (productCategory) {
        return res.status(400).json({ error: 'Категорія існує' });
    }

    const newCategory = new Category({
        name,
    });
    await newCategory.save();
    res.status(201).json(newCategory);
});

router.put('/:id', async (req, res) => {
    const { name } = req.body;
    const categoryId = req.params.id;

    // Перевірка чи категорія існує перед оновленням
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
        return res.status(404).json({ error: 'Категорію не знайдено' });
    }

    existingCategory.name = name;

    await existingCategory.save();
    res.json(existingCategory);
});

// DELETE операція для видалення категорії за заданим id
router.delete('/:id', async (req, res) => {
    const categoryId = req.params.id;

    // Перевірка чи категорія існує перед видаленням
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
        return res.status(404).json({ error: 'Категорію не знайдено' });
    }
    await Category.deleteOne({ _id: existingCategory._id });

    res.json({ message: 'Категорію успішно видалено' });
});
router.get('/all', async (req, res) => {
    const { categoryName } = req.query;

    const filters = {};
    if (categoryName) {
        filters['name'] = { $regex: categoryName, $options: 'i' };
    }

    const categories = await Category.find(filters);
    res.json(categories);
});

module.exports = router;
