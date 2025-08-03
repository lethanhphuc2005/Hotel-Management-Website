const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

// Dummy user store (hoặc dùng DB)
const users = [];

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/v1/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      // Tùy bạn xử lý user: tạo mới hoặc tìm trong DB
      const user = {
        googleId: profile.id,
        first_name: profile.name.givenName || "",
        last_name: profile.name.familyName || "",
        email: profile.emails?.[0]?.value || "",
        email_verified: profile.emails?.[0]?.verified || false,
        picture: profile.photos?.[0]?.value || "",
      };
      users.push(user); // hoặc lưu DB
      return done(null, user);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/v1/auth/facebook/callback`,
      profileFields: ["id", "emails", "name", "picture.type(large)"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = {
        facebookId: profile.id,
        first_name: profile.name?.givenName || "",
        last_name: profile.name?.familyName || "",
        email: profile.emails?.[0]?.value || "",
        picture:
          profile.photos?.[0]?.value ||
          `https://graph.facebook.com/${profile.id}/picture?type=large`,
      };
      users.push(user); // hoặc lưu DB
      return done(null, user);
    }
  )
);

module.exports = passport;
