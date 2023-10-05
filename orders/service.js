const Order = require('./models');
const joi = require('joi');

class OrderService {
    async createOrder(req) {
        // Код для створення замовлення
    }

    async getOrders(queryFilters) {
        // Змінено ім'я параметра на queryFilters
        const { productName, minTotalAmount, maxTotalAmount } = queryFilters;

        const filters = {}; // Замінено ім'я змінної на filters
        if (productName) {
            filters['products.name'] = { $regex: productName, $options: 'i' };
        }
        if (minTotalAmount && maxTotalAmount) {
            filters['emaunt'] = { $gte: minTotalAmount, $lte: maxTotalAmount };
        } else if (minTotalAmount) {
            filters['emaunt'] = { $gte: minTotalAmount };
        } else if (maxTotalAmount) {
            filters['emaunt'] = { $lte: maxTotalAmount };
        }

        const orders = await Order.find(filters).populate('products').exec();

        if (orders.length > 0) {
            return { status: 200, data: orders };
        } else {
            return { status: 404, error: 'Замовлення не знайдено' };
        }
    }

    async getOrderById(id) {
        // Код для отримання замовлення за id
    }
}

module.exports = OrderService;
