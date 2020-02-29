const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

mongoose.connect('mongodb+srv://admin:admin@cluster0-adzek.azure.mongodb.net/shop_manager?retryWrites=true&w=majority',
{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => console.log('Connection to MongoDB successful'))
.catch((err) => console.error(err));


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.get("/", (req, res) => {
    res.json('Express server running');
});

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;