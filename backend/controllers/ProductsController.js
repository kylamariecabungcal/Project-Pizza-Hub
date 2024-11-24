const Product = require('../models/ProductsModel');
const Inventory = require('../models/InventoryModel');
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


const createProduct = async (req, res) => {
    const { name, price, description, category, stock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    console.log("Uploaded file:", req.file);

    if (!name || !price || !description || !category || !stock) {
        return res.status(400).json({ error: 'name, price, description, category, quantity, and image are required.' });
    }

    try {
       
        const product = new Product({ name, price, description, category, stock, image });
        await product.save();

     
        const inventory = new Inventory({
            product: product._id,  
            stock: stock,         
        });
        await inventory.save(); 

       
        res.status(201).json({
            product,
            inventory,
        });
    } catch (error) {
        console.error('Error saving product:', error);
        res.status(500).json({ error: error.message });
    }
};



const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateProduct = async (req, res) => {
    const { name, price, description, category, stock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !price || !description || !category || !stock) {
        return res.status(400).json({ error: "All fields except image are required." });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            name, price, description, category, stock, image
        }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }


        const updatedInventory = await Inventory.findOneAndUpdate(
            { product: req.params.id }, 
            { stock }, 
            { new: true } 
        );

        if (!updatedInventory) {
            return res.status(404).json({ error: 'Inventory not found' });
        }

        res.status(200).json({
            updatedProduct,
            updatedInventory
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Error updating product' });
    }
};


module.exports = {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct,
    upload
};
