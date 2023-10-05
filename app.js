const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const winston = require('winston');

const passport = require('passport');
require('dotenv').config();
const app = express();
require('./jwt-and-passport-auth/auth/auth');
const routes = require('./jwt-and-passport-auth/routes/routes');
const secureRoute = require('./jwt-and-passport-auth/routes/secure-routes');
const productsRoute = require('./products/router');
const categoryRoute = require('./category/router');
const ordersRoute = require('./orders/router');
const imageRoutes = require('./imageRoutes');
const uploadFolder = 'uploads/';



const logger = winston.createLogger({
    level: 'info', // Рівень логування (може бути 'info', 'warn', 'error', тощо)
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(), // Вивід логів у консоль
        new winston.transports.File({ filename: 'app.log' }), // Збереження логів у файл 'app.log'
    ],
});

app.use('/images', imageRoutes);

app.use(bodyParser.json());

app.use('/', routes);

// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use('/user', passport.authenticate('jwt', { session: false }), secureRoute);
app.use(
    '/orders',
    passport.authenticate('jwt', { session: false }),
    ordersRoute
);
app.use(
    '/products',
    passport.authenticate('jwt', { session: false }),
    productsRoute
);
app.use(
    '/category',
    passport.authenticate('jwt', { session: false }),
    categoryRoute
);

// Handle errors.

app.use(function (err, req, res, next) {
    logger.error(err);
    res.status(err.status || 500);
    res.end();
});

app.listen(3000, () => {
    console.log('Server started.');
});

// Підключення до бази даних MongoDB (замініть URL на свій)

mongoose.connect(process.env.DB_CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
