const express = require('express');
const {
    createInventory,
    getInventories,
    getInventory,
    deleteInventory,
    updateInventory,
    upload
} = require('../controllers/InventoryController');

const router = express.Router();


router.post('/new', createInventory);


router.get('/', getInventories);


router.get('/:id', getInventory);


router.delete('/:id', deleteInventory);


router.patch('/:id', updateInventory);

module.exports = router;
