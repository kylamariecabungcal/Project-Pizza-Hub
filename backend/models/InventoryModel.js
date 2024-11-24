const mongoose = require('mongoose');


const inventorySchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'Product',  
        required: true,  
    },
    total_stocks: {
        type: Number,
        required: true,
    },
    quantity_sold: {
        type: Number,
        required: true,
    },
    wasted_stocks: {
        type: Number,
        required: true,
    },
    current_stocks: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
