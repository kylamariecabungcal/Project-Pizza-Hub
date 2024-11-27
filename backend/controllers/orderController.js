const Order = require('../models/orderModel');
const Product = require('../models/ProductsModel');
const Sales = require('../models/salesModel');
const Inventory = require('../models/InventoryModel'); 

const createOrder = async (req, res) => {
    const { orderDetails, totalAmount } = req.body;

    if (!orderDetails || !totalAmount) {
        return res.status(400).json({ error: 'Order details and totalAmount are required.' });
    }

    try {
        for (const item of orderDetails) {
            const product = await Product.findById(item.productId);  
            if (!product) {
                return res.status(404).json({ error: `Product with ID ${item.productId} not found.` });
            }

            item.price = product.price;
            item.total = item.quantity * item.price;

            if (product.stock < item.quantity) {
                return res.status(400).json({ error: `Not enough stock for product: ${product.name}` });
            }

            product.stock -= item.quantity;
            await product.save();

            const inventory = await Inventory.findOne({ product: item.productId });
            if (inventory) {
                inventory.stock -= item.quantity;
                await inventory.save();
            }

            const sale = new Sales({
                product: item.productId,
                quantity: item.quantity,
                totalPrice: item.total,
                date: Date.now(),
            });

            await sale.save();
        }

        const order = new Order({
            orderDetails,
            totalAmount,
            orderDate: Date.now(),
        });

        await order.save();

        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('orderDetails.productId'); 
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id).populate('orderDetails.productId');
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { orderDetails, totalAmount } = req.body;

    if (!orderDetails || !totalAmount) {
        return res.status(400).json({ error: 'Order details and totalAmount are required.' });
    }

    try {
        for (const item of orderDetails) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ error: `Product with ID ${item.productId} not found.` });
            }

            item.price = product.price;
            item.total = item.quantity * item.price;
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { orderDetails, totalAmount, orderDate: Date.now() },
            { new: true } 
        );

        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    updateOrder,
    deleteOrder,
};