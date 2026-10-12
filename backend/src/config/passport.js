import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import {User} from '../models/user.model.js';

console.log({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ? "Present" : "Missing",
  callbackURL:
    process.env.GOOGLE_CALLBACK_URL ||
    `${process.env.BACKEND_URL || "http://localhost:8000"}/auth/google/callback`,
});

passport.use(
    new GoogleStrategy(
        {
          
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:
                process.env.GOOGLE_CALLBACK_URL ||
                `${process.env.BACKEND_URL || "http://localhost:8000"}/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                if (!email) {
                    return done(new Error("Google account has no email"), null);
                }

                const avatar = profile.photos?.[0]?.value || null;
                const existingUser = await User.findOne({ email: email.toLowerCase() });
                if (existingUser) {
                    if (!existingUser.googleId) {
                        existingUser.googleId = profile.id;
                        if (avatar) existingUser.avatar = avatar;
                        await existingUser.save();
                    }
                    return done(null, existingUser);
                }

                const newUser = await User.create({
                    googleId: profile.id,
                    name: profile.displayName || email.split("@")[0],
                    email,
                    avatar,
                    password: null,
                });

                return done(null, newUser);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

export default passport;