var express = require('express');
var router = express.Router();
var inspect = require('util').inspect;
var config = require('../../config');

/* GET home page. */
router.get('/', function(req, res, next) {

    res.send('Relax. We will put the home page here later.');

});

module.exports = router;
