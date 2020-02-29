const mongoose = require('mongoose');
const Order    = require('../models/order');
const Product       = require('../models/product');
const DetailOrder   = require('../models/detail_order');

exports.get_all = (req, res, next) => {
    Order.find().select('product order_code order_status final_quantity final_total')
        .exec().then(orders => {
            res.status(200).json({
                count: orders.length,
                orders: orders.map(order => {
                    return {
                        _id: order._id,
                        order_code: order.order_code,
                        order_status: order.order_status,
                        final_quantity: order.final_quantity,
                        final_total: order.final_total
                    }
                })
            })
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.get_by_id = (req, res, next) => {
    Order.findById(req.params.order_id)
        .exec().then(order => {
            if (order) {
                DetailOrder.find({ order_id: order._id }).select('product_id quantity total')
                    .populate('order').exec(function (err, detail) {
                    res.status(200).json({
                        _id: order._id,
                        order_code: order.order_code,
                        order_status: order.order_status,
                        final_quantity: order.final_quantity,
                        final_total: order.final_total,
                        detail_order: detail
                    })
                });
            }else {
                res.status(404).json({
                    message: 'Order not found'
                });
            }
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        });
}

exports.create_order = (req, res, next) => {
    const post_data = req.body;
    var save_quantity = 0;
    var save_total    = 0;

    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        order_code: 'HD-' + makeID(7),
    }).save().then(result => {

        for (const ops of post_data) {
            saveDetail(result._id, ops.product_id, ops.quantity, function (err, product_price) {
                save_quantity += ops.quantity;
                save_total += ops.quantity * product_price;

                Order.updateOne({ _id: result._id }, { final_quantity: save_quantity, final_total: save_total }).exec();
            });
        }
  
        }).then(res.status(201).json({
            message: 'Order created'
        })).catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.update_order = (req, res, next) => {
    const post_data = req.body;
    const order_id  = req.params.order_id;
    var save_quantity = 0;
    var save_total = 0;

    Order.findById(order_id)
        .exec().then(order => {
            if (order) {
                if (order.order_status == 'draft') {
                    DetailOrder.deleteMany({ order_id: order_id }).exec().then(result => {
                        for (const ops of post_data) {
                            if (ops.status) {
                                Order.updateOne({ _id: order_id }, { order_status: ops.status }).exec();
                            }

                            saveDetail(order_id, ops.product_id, ops.quantity, function (err, product_price) {
                                save_quantity += ops.quantity;
                                save_total += ops.quantity * product_price;

                                Order.updateOne({ _id: order_id }, { final_quantity: save_quantity, final_total: save_total }).exec();
                            });
                        }
                    }).then(result => {
                        res.status(200).json({
                            message: 'Order updated'
                        })
                    });
                } else if (order.order_status == 'paid') {
                        for (const ops of post_data) {

                            if (ops.status && ops.status == 'canceled') {
                                Order.updateOne({ _id: order_id }, { order_status: ops.status }).exec().then(result => {
                                    res.status(200).json({
                                        message: 'Order updated'
                                    })
                                });
                            }
                        }
                } else {
                    res.status(500).json({
                        message: 'Update Invalid!'
                    })
                } 
            } else {
                res.status(404).json({
                    message: 'Order not found'
                });
            }
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        });
}


function saveDetail(order_id, product_id, quantity, callback) {
    Product.findById(product_id).select('product_price')
        .exec().then(doc => {
            if (doc) {
                const detail = new DetailOrder({
                    _id: new mongoose.Types.ObjectId(),
                    order_id: order_id,
                    product_id: product_id,
                    quantity: quantity,
                    total: quantity * doc.product_price
                });

                detail.save();
                callback(null, doc.product_price);
            }
        });
}

function makeID(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}