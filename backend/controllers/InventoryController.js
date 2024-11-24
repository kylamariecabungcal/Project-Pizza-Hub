const Inventory = require('../models/InventoryModel');
const Product = require('../models/productModel');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


const createInventory = async (req, res) => {
    const { productId, total_stocks, quantity_sold, wasted_stocks } = req.body;

    if (!productId || !total_stocks || !quantity_sold || !wasted_stocks) {
        return res.status(400).json({ error: 'Product ID, total stocks, quantity sold, and wasted stocks are required.' });
    }

    try {
    
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const current_stocks = total_stocks - quantity_sold - wasted_stocks;

        const inventory = new Inventory({
            productId, 
            total_stocks,
            quantity_sold,
            wasted_stocks,
            current_stocks
        });

        await inventory.save();
        res.status(201).json(inventory); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getInventories = async (req, res) => {
    try {
        const inventories = await Inventory.find().populate('productId');  
        res.status(200).json(inventories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getInventory = async (req, res) => {
    const { id } = req.params;
    try {
        const inventory = await Inventory.findById(id).populate('productId');
        if (!inventory) {
            return res.status(404).json({ error: 'Inventory not found' });
        }
        res.status(200).json(inventory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const updateInventory = async (req, res) => {
    const { productId, total_stocks, quantity_sold, wasted_stocks } = req.body;

    if (!productId || !total_stocks || !quantity_sold || !wasted_stocks) {
        return res.status(400).json({ error: 'Product ID, total stocks, quantity sold, and wasted stocks are required.' });
    }

    try {
       
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

       
        const current_stocks = total_stocks - quantity_sold - wasted_stocks;

        const updatedInventory = await Inventory.findByIdAndUpdate(
            req.params.id,
            { productId, total_stocks, quantity_sold, wasted_stocks, current_stocks },
            { new: true }  
        );

        if (!updatedInventory) {
            return res.status(404).json({ error: 'Inventory not found' });
        }

        res.status(200).json(updatedInventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const deleteInventory = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedInventory = await Inventory.findByIdAndDelete(id);
        if (!deletedInventory) {
            return res.status(404).json({ error: 'Inventory not found' });
        }
        res.status(200).json({ message: 'Inventory deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = {
    createInventory,
    getInventories,
    getInventory,
    updateInventory,
    deleteInventory,
    upload
};
