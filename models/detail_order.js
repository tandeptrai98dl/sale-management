const mongoose = require('mongoose');

const detailOrderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    product_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    quantity: { type: Number, default: 1 },
    total:    { type: Number}
});

module.exports = mongoose.model('DetailOrder', detailOrderSchema);
