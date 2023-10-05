const express = require('express');
const router = express.Router();
const Order = require('./models');

router.get('/statistics', async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalAmount = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' },
                },
            },
        ]);

        const statistics = {
            totalOrders,
            totalAmount: totalAmount[0].total || 0,
        };

        res.json(statistics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Помилка отримання статистики' });
    }
});
module.exports = router;
