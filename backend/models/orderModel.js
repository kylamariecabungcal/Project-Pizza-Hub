const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderDate: {
        type: Date,
        default: Date.now, 
    },
    totalAmount: {
        type: Number,
        required: true, 
    },
    orderDetails: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true, 
            },
            price: {
                type: Number,
                required: true, 
            },
            total: {
                type: Number,
                required: true, 
            },
        },
    ],
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

module.exports = Order;
