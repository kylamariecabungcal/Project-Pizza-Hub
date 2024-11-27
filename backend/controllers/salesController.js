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
            date: new Date().toISOString(),
        });

        await sale.save();

        res.status(201).json(sale);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getSales = async (req, res) => {
    try {
        const { date, page = 1, limit = 10 } = req.query;

        let filter = {};
        if (date) {

            const localDate = new Date(date);
            const startOfDay = new Date(localDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(startOfDay);
            endOfDay.setHours(23, 59, 59, 999);

            filter.date = { $gte: startOfDay, $lte: endOfDay };
        }

        const totalSalesPerDay = await Sales.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    totalSalesAmount: { $sum: "$totalPrice" },
                },
            },
            { $sort: { _id: -1 } },
        ]);

        const totalSalesPerPizzaPerDay = await Sales.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'productInfo',
                },
            },
            { $unwind: '$productInfo' },
            {
                $group: {
                    _id: {
                        pizza: '$productInfo.name',
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    },
                    totalSalesAmount: { $sum: '$totalPrice' },
                },
            },
            { $sort: { '_id.date': -1 } },
        ]);

        const totalPages = Math.ceil(totalSalesPerDay.length / limit);

        const sales = await Sales.find(filter)
            .populate('product', 'name _id') // Populate product with only the necessary fields
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            sales,
            totalSalesPerDay,
            totalSalesPerPizzaPerDay,
            totalPages,
            currentPage: page,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getSale = async (req, res) => {
    const { id } = req.params;     

    try {

        const sale = await Sales.findById(id).populate('product', 'name _id');

        if (!sale) {
            return res.status(404).json({ error: 'Sale not found' });
        }

        res.status(200).json(sale);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
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


        // Restore the product stock from the previous sale before updating
        const previousProduct = await Product.findById(sale.product);
        if (previousProduct) {
            previousProduct.stock += sale.quantity;
            await previousProduct.save();
        }

        const totalPrice = product.price * quantity;

        if (product.stock < quantity) {
            return res.status(400).json({ error: `Not enough stock for product: ${product.name}` });
        }

        product.stock -= quantity;
        await product.save();


        sale.product = productId;
        sale.quantity = quantity;
        sale.totalPrice = totalPrice;
        sale.date = Date.now();

        await sale.save();

        res.status(200).json(sale);
    } catch (error) {
        console.error(error);
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
        console.error(error);
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
        console.error(error);
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
