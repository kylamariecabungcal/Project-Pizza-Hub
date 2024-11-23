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


const createProduct = async (req, res) => {
    const { productName, price } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    console.log("Uploaded file:", req.file);

    
    if (!productName || !price || !image) {
        return res.status(400).json({ error: 'Product name, price, and image are required.' });
    }

    try {
        const product = new Product({ productName, price, image });
        await product.save();
        res.status(200).json(product);
    } catch (error) {
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

module.exports = { createProduct, getProducts, upload };



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


const updateProduct = (req, res) => {

    const { productName, price } = req.body;
    const image = req.file ? req.file.path : null; 

    if (!productName || !price) {
        return res.status(400).json({ error: "All fields are required." });
    }


    Product.findByIdAndUpdate(req.params.id, {
        productName,
        price,
        image
    }, { new: true })
    .then(updatedProduct => {
        res.json(updatedProduct); 
    })
    .catch(error => {
        res.status(500).json({ error: "Error updating product" });
    });
};

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct,
    upload 
};
