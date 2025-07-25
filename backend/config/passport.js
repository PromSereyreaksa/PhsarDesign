const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  const [user] = await User.findOrCreate({
    where: { email: profile.emails[0].value },
    defaults: { name: profile.displayName, password: 'social-login', role: 'client' },
  });
  return done(null, user);
}));

module.exports = passport;
