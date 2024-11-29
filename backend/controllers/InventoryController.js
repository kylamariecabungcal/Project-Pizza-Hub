const Inventory = require('../models/InventoryModel');
const Product = require('../models/ProductsModel'); 


const createInventory = async (req, res) => {
    const { productId, stock } = req.body;

    if (!productId || !stock) {
        return res.status(400).json({ error: 'Product ID and stock are required.' });
    }

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        let inventory = await Inventory.findOne({ product: productId });

        if (inventory) {
    
            inventory.stock += stock; 
            inventory = await inventory.save();

            
            product.stock += stock;
            await product.save();

            return res.status(200).json({ inventory, product });
        } else {
    
            const newInventory = new Inventory({
                product: productId,
                stock,
            });
            await newInventory.save();

    
            product.stock += stock;
            await product.save();

            return res.status(201).json({ newInventory, product });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getInventories = async (req, res) => {
    try {
        const inventories = await Inventory.find().populate('product'); 
        res.status(200).json(inventories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getInventory = async (req, res) => {
    const { id } = req.params;

    try {
        const inventory = await Inventory.findById(id).populate('product');
        if (!inventory) {
            return res.status(404).json({ error: 'Inventory not found' });
        }

        res.status(200).json(inventory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const updateInventory = async (req, res) => {
    const { id } = req.params;
    const { name, price, stock } = req.body;

    if (name === undefined && price === undefined && stock === undefined) {
        return res.status(400).json({ error: 'At least one field (name, price, or stock) must be provided to update.' });
    }

    try {
    
        const inventory = await Inventory.findById(id).populate('product');
        
        if (!inventory) {
            return res.status(404).json({ error: 'Inventory not found.' });
        }

        
        if (name !== undefined) {
            inventory.product.name = name;  
        }

        if (price !== undefined) {
            inventory.product.price = price; 
        }

        if (stock !== undefined) {
            const stockDifference = stock - inventory.stock;
            inventory.stock = stock;  
            inventory.product.stock += stockDifference; 
        }

    
        await inventory.product.save(); 
        await inventory.save(); 

        res.status(200).json({ inventory, product: inventory.product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteInventory = async (req, res) => {
    const { id } = req.params;

    try {
        
        const deletedInventory = await Inventory.findByIdAndDelete(id).populate('product');

        if (!deletedInventory) {
            return res.status(404).json({ error: 'Inventory not found' });
        }

        
        const product = deletedInventory.product;
        
        
        const remainingInventory = await Inventory.findOne({ product: product._id });

        if (!remainingInventory) {
            
            await Product.findByIdAndDelete(product._id);
            return res.status(200).json({ message: 'Inventory and associated product deleted successfully' });
        }

        product.stock -= deletedInventory.stock;
        await product.save();

        res.status(200).json({ message: 'Inventory deleted successfully, product stock updated', product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createInventory,
    getInventories,
    getInventory,
    updateInventory,
    deleteInventory,
};
