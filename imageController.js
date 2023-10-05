const fs = require('fs');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
                '-' +
                uniqueSuffix +
                path.extname(file.originalname)
        );
    },
});
function generateUniqueImageName() {
    return Date.now().toString() + '.jpg';
}

const imageSchema = new mongoose.Schema({
    path: String, // Зберігати шлях до зображення
});

module.exports = mongoose.model('Image', imageSchema);
const upload = multer({ storage: storage });
