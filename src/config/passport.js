const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy',
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  (accessToken, refreshToken, profile, done) => {
    let user = User.findByGoogleId(profile.id);
    if (!user) {
        const id = User.create({
            email: profile.emails[0].value,
            google_id: profile.id,
            name: profile.displayName
        });
        user = User.findById(id);
    }
    return done(null, user);
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    const user = User.findById(id);
    done(null, user);
});

module.exports = passport;
