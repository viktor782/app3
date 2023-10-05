const Product = require('./model');

class ProductService {
    async createProduct(data) {
        try {
            const { name, description, price, category, image } = data;
            const newProduct = new Product({
                name,
                description,
                price,
                category,
                image,
            });
            const savedProduct = await newProduct.save();
            return { status: 201, data: savedProduct };
        } catch (error) {
            return { status: 500, error: 'Помилка при створенні продукту' };
        }
    }

    async getProducts() {
        const products = await Product.find().populate('category');

        if (products.length > 0) {
            return { status: 200, data: products };
        } else {
            return { status: 404, error: 'Продукти не знайдено' };
        }
    }

    async getProductById(productId) {
        const product = await Product.findById(productId).populate('category');

        if (product) {
            return { status: 200, data: product };
        } else {
            return { status: 404, error: 'Продукт не знайдено' };
        }
    }

    async getFilteredProducts(queryFilters) {
        // Код для отримання фільтрованих продуктів
    }

    async updateProduct(productId, data) {
        try {
            const { name, description, category } = data;

            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                { name, description, category },
                { new: true }
            );

            if (updatedProduct) {
                return { status: 200, data: updatedProduct };
            } else {
                return { status: 404, error: 'Продукт не знайдено' };
            }
        } catch (error) {
            return { status: 500, error: 'Помилка оновлення продукта' };
        }
    }

    async deleteProduct(productId) {
        try {
            const deletedProduct = await Product.findByIdAndRemove(productId);

            if (deletedProduct) {
                return { status: 200, message: 'Продукт видалено' };
            } else {
                return { status: 404, error: 'Продукт не знайдено' };
            }
        } catch (error) {
            return { status: 500, error: 'Помилка видалення продукта' };
        }
    }
}

module.exports = ProductService;
