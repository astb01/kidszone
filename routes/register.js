const router = require('express').Router();
const passport = require('passport');
const { check, validationResult } = require('express-validator/check');
const User = require('../models/User');

// Used to validate sequences:
const NUMBERS = "0123456789";
const ALPHA = "abcdefghijklmnopqrstuvwx";

router.get('/', (req, res) => {
  console.log(`==> Request made to: ${req.url}`);
  res.render('register', {
    form: req.form || {},
    registerErrors: req.registerErrors || {}
  });
});

router.post('/', [
  check('firstName')
    .not().isEmpty()
    .withMessage('First Name(s) is required')
    .matches(/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/i)
    .withMessage('First Name(s) must only contain characters and spaces')
    .trim()
    .escape(),

  check('lastName')
    .not().isEmpty()
    .withMessage('Last Name is required')
    .matches(/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/i)
    .withMessage('Last Name must only contain characters and spaces')
    .trim()
    .escape(),

  check('gender', 'Gender is required').not().isEmpty(),

  check('username')
    .not().isEmpty()
    .withMessage('Username is required')
    .isEmail()
    .withMessage('Username must be a valid email address')
    .normalizeEmail()
    .trim()
    .escape(),

  check('password')
    .not().isEmpty()
    .withMessage('Password is required')
    .custom((value) => {
      const userValue = value.toLowerCase();
      return !NUMBERS.includes(userValue) || !ALPHA.includes(userValue);
    })
    .withMessage("Password cannot be a sequence such as 012345 or abcdef"),

  check('confPassword')
    .not().isEmpty()
    .withMessage('Confirmation Password is required')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage('Password and Confirmation Password do not match')
], (req, res) => {
  const { username, password, firstName, lastName } = req.body;
  console.log(`==> Register request for ${username} received!`);

  // check if there are any validation errors. If we do, then render errors back to client.
  const registrationResult = validationResult(req);

  if (!registrationResult.isEmpty()) {
    res.render('register', { registerErrors: registrationResult.mapped(), form: req.body });
  }
  else {
    User.register(new User({ username, firstName, lastName }), password,(err, user) => {
      if (err) return res.render('register', { user });

      console.log(`==> Created user: ${username}`);
      passport.authenticate('local')(req, res, () => {
        req.flash('registerMsg', "You have successfully been registered. Please log in below");
        req.flash('route', 'register');
        res.redirect('/');
      });
    });
  }
});


module.exports = router;