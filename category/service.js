const Category = require('./model');
const joi = require('joi');
const category = require('./validation');

class CategoryService {
    async getAllCategories() {
        try {
            const categories = await Category.find();
            return categories;
        } catch (error) {
            throw new Error('Error fetching categories');
        }
    }

    async createCategory(name) {
        try {
            const productCategory = await Category.findOne({ name });
            if (productCategory) {
                throw new Error('Category already exists');
            }

            const newCategory = new Category({
                name,
            });
            await newCategory.save();
            return newCategory;
        } catch (error) {
            throw new Error('Error creating category');
        }
    }

    async updateCategory(id, name) {
        try {
            const existingCategory = await Category.findById(id);
            if (!existingCategory) {
                throw new Error('Category not found');
            }

            existingCategory.name = name;
            await existingCategory.save();
            return existingCategory;
        } catch (error) {
            throw new Error('Error updating category');
        }
    }

    async deleteCategory(id) {
        try {
            const existingCategory = await Category.findById(id);
            if (!existingCategory) {
                throw new Error('Category not found');
            }

            await Category.deleteOne({ _id: existingCategory._id });
        } catch (error) {
            throw new Error('Error deleting category');
        }
    }

    async getCategoriesByName(categoryName) {
        try {
            const filters = {};
            if (categoryName) {
                filters['name'] = { $regex: categoryName, $options: 'i' };
            }

            const categories = await Category.find(filters);
            return categories;
        } catch (error) {
            throw new Error('Error fetching categories by name');
        }
    }
}

module.exports = CategoryService;
