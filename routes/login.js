const router = require('express').Router();
const config = require('config');
const passport = require('passport');

router.post('/', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: "Invalid username or password",
  successFlash: "Welcome to Kids Zone!"
})
);

router.get('/', (req, res) => {
  console.log(`==> Rendering login view`);
  
  let loggedOut = req.query.loggedOut ? true : false;
  res.locals.logout = loggedOut;

  const errors = req.flash('error');

  res.render('login', {
    loginErrs: errors.length > 0 ? [ errors ] : null,
    registerMsg: req.flash('registerMsg') || ''
  });
});


module.exports = router;