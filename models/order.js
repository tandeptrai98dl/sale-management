const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    order_code: { type: String},
    order_status: { type: String, default: 'draft' },
    final_quantity: { type: Number, default: 1 },
    final_total: { type: Number }
});

module.exports = mongoose.model('Order', orderSchema);
