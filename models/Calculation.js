const mongoose = require('mongoose');

const calculationSchema = new mongoose.Schema({
    persons: Number,
    items: [
        {
            itemName: String,
            status: String,
            cookedQuantity: Number,
            requiredQuantity: Number,
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Calculation', calculationSchema);
