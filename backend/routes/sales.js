const express = require('express');
const router = express.Router();
const {
    createSale,
    getSales,
    getSale,
    updateSale,
    deleteSale,
    getTotalSales,
} = require('../controllers/salesController');


router.post('/', createSale);


router.get('/', getSales);

router.get('/:id', getSale);


router.put('/:id', updateSale);


router.delete('/:id', deleteSale);


router.get('/total-sales', getTotalSales);

module.exports = router;
