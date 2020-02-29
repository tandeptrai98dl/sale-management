const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product_code: { type: String, required: true },
    product_name: { type: String, required: true },
    product_quantity: { type: Number, required: true },
    product_price: {type: Number, required: true}
});

module.exports = mongoose.model('Product', productSchema);
