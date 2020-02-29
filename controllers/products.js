const Product  = require('../models/product');
const mongoose = require('mongoose');

exports.get_all = (req, res, next) => {
    Product.find().select('product_code product_name product_quantity product_price')
        .exec().then(docs => {
            res.status(200).json({
                count: docs.length,
                products: docs
            });
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        });
}

exports.get_by_id = (req, res, next) => {
    const id = req.params.product_id;

    Product.findById(id).select('product_code product_name product_quantity product_price')
        .exec().then(doc => {
            if (doc) {
                res.status(200).json({
                    product: doc
                });
            } else {
                res.status(404).json({
                    message: 'Product not found'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}


exports.create_product = (req, res, next) => {
    const post_data = req.body;
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        product_code: post_data.product_code,
        product_name: post_data.product_name,
        product_price: post_data.product_price,
        product_quantity: post_data.product_quantity,
    });

    product.save().then(result => {
        res.status(200).json({
            message: 'Created product',
            creted_product: result
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    });
}

exports.update_product = (req, res, next) => {
    const id = req.params.product_id;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.key] = ops.value;
    }

    Product.update({ _id: id }, { $set: updateOps }).exec()
        .then(result => {
            res.status(200).json({
                message: 'Product updated'
            });
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.delete_product = (req, res, next) => {
    const id = req.params.product_id;

    Product.remove({ _id: id }).exec().then(result => {
        res.status(200).json({
            message: 'Product deleted'
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
}