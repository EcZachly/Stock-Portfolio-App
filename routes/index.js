var express = require('express');
var router = express.Router();
var portfolio = require('./portfolio');
var stock = require('./stock');
var user  = require('./user');


router.post('/user/new', user.create);

router.get('/stock', stock.getStockData);

module.exports = router;