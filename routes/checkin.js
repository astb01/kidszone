const router = require('express').Router();
const data  = require('../data/data');
const minders = data.minders;
const uuid = require('uuid/v4');

router.get('/', (req, res) => {
  const parentKey = Math.random().toString(36).substr(2, 9).toUpperCase();

  res.render('checkin', { minders, parentKey });
});

router.post('/', (req, res) => {
  res.redirect('/');
})


module.exports = router;