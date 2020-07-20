const jwt = require('jwt-simple');

const config = require('../config');
const User = require('../models/user');


const userToken = user => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = (req, res, next) => {
  res.send({ token: userToken(req.user) });
}

exports.signup = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must enter a username and password.'});
  }
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(422).send({ error: 'Email is already registered!' });
    }
    const newUser = new User({ email, password });
    try {
      const savedUser = await newUser.save();
      res.send({ token: userToken(savedUser) });
    } catch (err) {
      return next(err);
    }
  } catch (err) {
    return next(err);
  }
}
