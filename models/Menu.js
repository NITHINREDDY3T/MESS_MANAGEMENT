const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    itemName: String,
    gramsPerPerson: Number,
});

module.exports = mongoose.model('Menu', menuSchema);
