const Sales = require('../models/salesModel');
const Product = require('../models/ProductsModel');


const createSale = async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({ error: 'Product ID and quantity are required.' });
    }

    try {
      
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: `Product with ID ${productId} not found.` });
        }

    
        if (product.stock < quantity) {
            return res.status(400).json({ error: `Not enough stock for product: ${product.name}` });
        }

     
        const totalPrice = product.price * quantity;

        product.stock -= quantity;
        await product.save(); 

        
        const sale = new Sales({
            product: productId,
            quantity,
            totalPrice,
            date: Date.now(),
        });

    
        await sale.save();

        
        res.status(201).json(sale);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getSales = async (req, res) => {
    try {
        const sales = await Sales.find().populate('product'); 
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSale = async (req, res) => {
    const { id } = req.params;

    try {
        const sale = await Sales.findById(id).populate('product');
        if (!sale) {
            return res.status(404).json({ error: 'Sale not found' });
        }

        res.status(200).json(sale);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const updateSale = async (req, res) => {
    const { id } = req.params;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({ error: 'Product ID and quantity are required.' });
    }

    try {
        
        const sale = await Sales.findById(id);
        if (!sale) {
            return res.status(404).json({ error: 'Sale not found' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: `Product with ID ${productId} not found.` });
        }

       
        const totalPrice = product.price * quantity;

        
        product.stock += sale.quantity; 
        product.stock -= quantity; 
        await product.save(); 

    
        sale.product = productId;
        sale.quantity = quantity;
        sale.totalPrice = totalPrice;
        sale.date = Date.now();

        await sale.save();

        res.status(200).json(sale);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const deleteSale = async (req, res) => {
    const { id } = req.params;

    try {
        const sale = await Sales.findById(id);
        if (!sale) {
            return res.status(404).json({ error: 'Sale not found' });
        }

    
        const product = await Product.findById(sale.product);
        if (product) {
            product.stock += sale.quantity;
            await product.save();
        }

    
        await sale.remove();

        res.status(200).json({ message: 'Sale deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getTotalSales = async (req, res) => {
    try {
        const totalSales = await Sales.aggregate([
            {
                $group: {
                    _id: null,
                    totalSalesAmount: { $sum: "$totalPrice" },
                },
            },
        ]);

        res.status(200).json({ totalSales: totalSales[0]?.totalSalesAmount || 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createSale,
    getSales,
    getSale,
    updateSale,
    deleteSale,
    getTotalSales,
};
