const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const User = require('../models/user');
const config = require('../config');


const localOptions = { usernameField: 'email' };
const jwtOptions = {
    jwtFromRequest : ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

// login strategy
passport.use(new LocalStrategy(localOptions,
  (email, password, done) => {
    User.findOne({ email }, (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }

      user.comparePassword(password, (err, isMatch) => {
        if (err) { return done(err); }
        if (!isMatch) { return done(null, false); }

        return done(null, user);
      });
    });
  })
);

// JSON Web Token strategy
passport.use(new JwtStrategy(jwtOptions,
  async (payload, done) => {
    try {
      const user = await User.findById(payload.sub);

      if (user) { return done(null, user); }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);
