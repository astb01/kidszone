var express = require('express');
var router = express.Router();

const data = require('../data/data');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(`==> Welcome message: ${req.flash('success')}`);
  const welcomeMsg = req.flash('success') ? req.flash('success')[0] : null;

  res.render('dashboard', 
      { title: 'Kids Zone',
        minders: data.minders,
        welcomeMsg });
});

module.exports = router;
