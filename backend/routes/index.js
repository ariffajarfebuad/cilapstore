const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');

router.post('/login', authController.login);
router.get('/products', orderController.getProducts);
router.post('/orders', orderController.createOrder);
router.get('/orders', orderController.getOrderHistory);

module.exports = router;
