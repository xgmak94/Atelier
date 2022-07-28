const express = require('express');
const controller = require('./controller.js');

const router = express.Router();

router.get('/products', controller.getAllProducts);
router.get('/products/:product_id', controller.getProduct);

router.get('/products/:product_id/styles', controller.getStyles);
router.get('/products/:product_id/related', controller.getRelated);

module.exports = router;