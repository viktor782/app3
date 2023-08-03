const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Підключення до бази даних MongoDB (замініть URL на свій)
const dbURL = 'mongodb://localhost:27017/usersDB';
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });

// Схема та модель користувача
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Парсер для даних POST-запитів
app.use(bodyParser.json());

// Реєстрація нового користувача
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Перевірка, чи користувач з таким ім'ям або email вже існує
        const existingUser = await User.findOne({
            $or: [{ username: username }, { email: email }],
        });
        if (existingUser) {
            return res.status(409).json({
                error: "Користувач з таким ім'ям або email уже існує",
            });
        }

        // Хешування паролю перед збереженням в базу даних
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Реєстрація успішна' });
    } catch (error) {
        console.error('Помилка реєстрації:', error);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

// Логін користувача
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Перевірка, чи існує користувач з таким ім'ям
        const user = await User.findOne({ username: username });
        if (!user) {
            return res
                .status(401)
                .json({ error: "Невірне ім'я користувача або пароль" });
        }

        // Перевірка паролю
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ error: "Невірне ім'я користувача або пароль" });
        }

        res.json({ message: 'Успішний вхід' });
    } catch (error) {
        console.error('Помилка логіну:', error);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

app.listen(port, () => {
    console.log(`Сервер запущено на порті ${port}`);
});
