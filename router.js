const Auth = require('./controllers/auth');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = app => {
  app.get('/', requireAuth, (req, res) => {
    res.send({ here: 'is your protected resource' });
  });
  app.post('/signup', Auth.signup);
  app.post('/signin', requireSignin, Auth.signin);
}
