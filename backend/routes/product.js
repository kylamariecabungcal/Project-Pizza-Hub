const express = require('express');
const {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct,
    upload
} = require('../controllers/productController');

const router = express.Router();


router.post('/new', upload.single('image'), createProduct);

router.get('/', getProducts);

router.get('/:id', getProduct);

router.delete('/:id', deleteProduct);

router.patch('/:id', updateProduct);

module.exports = router;
