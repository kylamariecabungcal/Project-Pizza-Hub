const express = require('express');
const { loginUser, getUser, createUser } = require('../controllers/userController');

const router = express.Router();


router.post('/login', loginUser);  


router.get('/:id', getUser); 

router.post('/register', createUser );

module.exports = router;
