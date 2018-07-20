const router = require('express').Router();

router.get('/', (req, res) => {
  req.session.destroy();
  req.logout();

  console.log(`==> Successfully logged out`);

  res.locals.logout = true;
  res.redirect('/login?loggedOut=success');
});

module.exports = router;