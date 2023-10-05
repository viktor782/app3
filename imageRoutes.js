const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Image = require('./imageController');
const winston = require('winston');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'file/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Генеруємо унікальне ім'я файлу
    },
});
const upload = multer({ storage: storage });

// Ми повині повернути об'єкт картинки з бази даних
router.post('/', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Файл не було завантажено' });
    }
    const imagePath = req.file.path;
    const image = new Image({ path: imagePath });
    await image.save();

    res.status(201).json(image);
});

// дістати імаге з бази даних по його айді далі видалити файл використовуючи шлях документа який ми дістали з бази
router.delete('/:imageId', async (req, res) => {
    const imageId = req.params.imageId;
    const image = await Image.findById(imageId);
    if (!image) {
        logger.error('Зображення не знайдено');
        return res.status(404).json({ message: 'Зображення не знайдено' });
    }
    fs.unlink(image.path, async (err) => {
        if (err) {
            logger.error(err); // добавити свій логер для логування помилки що файла не існує
        }

        await Image.deleteOne({ _id: image._id });
        res.status(204).end();
    });
});

module.exports = router;

                                                                             
