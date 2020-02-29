const mongoose = require('mongoose');
const express  = require('express');
const router   = express.Router();

const OrderController = require ('../controllers/orders');

router.get('/', OrderController.get_all);

router.get('/:order_id', OrderController.get_by_id);

router.post('/', OrderController.create_order);

router.patch('/:order_id', OrderController.update_order);

module.exports = router;