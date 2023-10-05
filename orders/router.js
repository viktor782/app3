const express = require('express');
const router = express.Router();
const Order = require('./models');
const joi = require('joi');
const Service = require('./service');
const { ProductsModel } = require('../products/model');
const logger = require('../logger');
const statistics = require('./statistics');

router.post('/', async (req, res) => {
    logger.log('info', 'Order creation started');
    const ordersSchema = joi.object({
        products: joi.array().required(),
    });
    const { error } = ordersSchema.validate(req.body);
    if (error) {
        logger.error(error.message);
        return res.status(400).json({ error: error.details[0].message });
    }
    const { products } = req.body;
    const productsData = await ProductsModel.find({ _id: { $in: products } });

    let amount = 0;
    productsData.forEach(({ price }) => {
        amount += price || 0;
    });
    const newOrder = new Order({
        products: productsData,
        userId: req.user._id,
        amount: amount,
    });
    await newOrder.save();
    logger.log('info', `New order created ${JSON.stringify(newOrder)}`);
    res.status(201).json(newOrder);
});

router.get('/', async (req, res) => {
    const { productName, minTotalAmount, maxTotalAmount } = req.query; // розібратись з цим

    const filters = {};
    if (productName) {
        filters['products.name'] = { $regex: productName, $options: 'i' };
    }
    if (minTotalAmount && maxTotalAmount) {
        filters['amaunt'] = { $gte: minTotalAmount, $lte: maxTotalAmount };
    } else if (minTotalAmount) {
        filters['amaunt'] = { $gte: minTotalAmount };
    } else if (maxTotalAmount) {
        filters['amaunt'] = { $lte: maxTotalAmount };
    }

    const orders = await Order.find(filters).populate('products').exec();

    if (orders.length > 0) {
        res.json(orders);
    } else {
        res.status(404).json({ message: 'Замовлення не знайдено' });
    }
});

router.get('/:id', async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('products')
        .exec();
    if (!order) {
        res.status(404).json({ error: 'Замовлення не знайдено' });
    } else {
        res.status(200).json(order);
    }
});

router.put('/:id', async (req, res) => {
    const orderId = req.params.id;
    const { products } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { products },
        { new: true }
    );

    if (!updatedOrder) {
        return res.status(404).json({ error: 'Замовлення не знайдено' });
    }

    res.json(updatedOrder);
});

router.delete('/:id', async (req, res) => {
    const orderId = req.params.id;
    const deletedOrder = await Order.findByIdAndRemove(orderId);

    if (!deletedOrder) {
        return res.status(404).json({ error: 'Замовлення не знайдено' });
    }

    res.json({ message: 'Замовлення успішно видалено' });
});
module.exports = router;
