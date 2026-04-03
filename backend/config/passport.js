const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

module.exports = function(passport) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
    profileFields: ['displayName', 'emails', 'photos']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Find user by googleId or email
      let user = await User.findOne({
        $or: [{ googleId: profile.id }, { email: profile.emails[0].value }]
      });

      if (user) {
        // Update googleId if only email match
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
      } else {
        // Create new user
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          role: 'user', // default
          avatar: profile.photos[0]?.value || ''
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
