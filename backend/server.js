const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require("./routes/user");
const productsRoutes = require('./routes/products');
const inventoryRoutes = require('./routes/inventory');
const orderRoutes = require('./routes/order');
const saleRoutes = require('./routes/sales');

const app = express();
const SECRET_KEY = 'your_secret_key';

app.use(cors());
app.use(bodyParser.json());  
app.use(express.static('public'));  
app.use('/uploads', express.static('uploads'));


app.use('/api/user', userRoutes);  


app.use('/api/products', productsRoutes);
app.use('/api/inventories', inventoryRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/sale', saleRoutes);

const mongoUri = "mongodb+srv://james:0827James@mernapp.zomz5.mongodb.net/Project-Pizza-Hub?retryWrites=true&w=majority&appName=MERNapp";  
const port = process.env.PORT || 4000;

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error.message);
    });
