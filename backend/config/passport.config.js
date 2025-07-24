const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Dummy user store (hoặc dùng DB)
const users = [];

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/google/callback",
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

module.exports = passport;
