const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/product');
const userRoutes = require("./routes/user");
const productsRoutes = require('./routes/Products');
const inventoryRoutes = require('./routes/inventory');
const orderRoutes = require('./routes/order')
const saleRoutes = require('./routes/sales')
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));  
app.use('/uploads', express.static('uploads')); 


app.use('/api/products', productRoutes);
app.use("/api/users", userRoutes);

const mongoUri = "mongodb+srv://james:0827James@mernapp.zomz5.mongodb.net/web?retryWrites=true&w=majority&appName=MERNapp";
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

