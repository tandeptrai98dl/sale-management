const mongoose = require('mongoose');
const express  = require('express');
const router   = express.Router();

const ProductController = require('../controllers/products');

router.get('/', ProductController.get_all);

router.get('/:product_id', ProductController.get_by_id);

router.post('/', ProductController.create_product);

router.patch('/:product_id', ProductController.update_product);

router.delete('/:product_id', ProductController.delete_product);

module.exports = router;
