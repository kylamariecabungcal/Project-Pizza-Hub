const express = require('express');
const {
    createOrder,
    getOrders,
    getOrder,
    updateOrder,
    deleteOrder,
} = require('../controllers/orderController');

const router = express.Router();


router.post('/new', createOrder);



router.get('/', getOrders);


router.get('/:id', getOrder);


router.delete('/:id', deleteOrder);


router.patch('/:id', updateOrder);

module.exports = router;
