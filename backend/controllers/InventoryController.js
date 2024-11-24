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

        const inventory = new Inventory({
            product: productId,
            stock,
        });

        await inventory.save();

        res.status(201).json(inventory);
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

    console.log('Fetching Inventory with ID:', id); 

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
    const { stock } = req.body;
    const { id } = req.params; 

    if (stock === undefined || isNaN(stock) || stock < 0) {
        return res.status(400).json({ error: 'Valid stock quantity is required.' });
    }

    try {
        console.log(`Fetching inventory with ID: ${id}`);

       
        const inventory = await Inventory.findById(id);
        if (!inventory) {
            console.log('Inventory not found with the provided ID.'); 
            return res.status(404).json({ error: 'Inventory not found' });
        }

        console.log('Found Inventory:', inventory);


        const product = await Product.findById(inventory.product);
        if (!product) {
            console.log('Product not found for this inventory:', inventory.product); 
            return res.status(404).json({ error: 'Product not found' });
        }


        console.log('Found Product:', product);

   
        const updatedInventory = await Inventory.findByIdAndUpdate(
            id,
            { stock, lastUpdated: Date.now() },
            { new: true } 
        );

        
        console.log('Updated Inventory:', updatedInventory);

        res.status(200).json(updatedInventory);
    } catch (error) {
        console.error('Error updating inventory:', error); 
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
