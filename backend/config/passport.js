import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Users } from '../models/index.js';

// Only configure Google OAuth if environment variables are present
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const [user] = await Users.findOrCreate({
        where: { email: profile.emails[0].value },
        defaults: { 
          name: profile.displayName, 
          password: 'social-login', 
          role: 'client' 
        },
      });
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));

  // Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user.userId);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await Users.findByPk(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
} else {
  console.warn("Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.");
}

export default passport;
