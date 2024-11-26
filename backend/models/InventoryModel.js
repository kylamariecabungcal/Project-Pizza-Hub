const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
