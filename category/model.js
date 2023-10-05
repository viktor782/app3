const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: String,
});

const categoryModule = mongoose.model('Category', categorySchema);
module.exports = categoryModule;
