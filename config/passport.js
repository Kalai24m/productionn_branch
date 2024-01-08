// passport.js
import passport from 'passport';
import passportJwt from 'passport-jwt';
import Key from './config/key.js';  // Replace with your actual secret key
import User from './models/User.js';  // Import your User model

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: Key.key,  // Replace with your actual secret key
};

passport.use(
  new JwtStrategy(options, (jwtPayload, done) => {
    // Check if the user exists in the database based on jwtPayload
    // You can query your database to get user details using jwtPayload.sub (user id)

    // Example:
    User.findById(jwtPayload.sub)
      .then(user => {
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      })
      .catch(err => done(err, false));
  })
);

export default passport;
