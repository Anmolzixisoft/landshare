const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const express = require('express')
const app = express()
const session = require('express-session')
const passport = require("passport");

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
app.use(session({ secret: "SESSION_SECRET" }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(
    new LinkedInStrategy(
        {
            clientID: '78xez2ai9obm3k',
            clientSecret: 'D9apUO2W6EsvwTaM',
            callbackURL: "http://localhost:5000/auth/linkedin/callback",
            // scope: ["r_emailaddress", "r_liteprofile"],
            scope: ['r_liteprofile'],
        },
        (
            accessToken,
            refreshToken,
            profile,
            done
        ) => {
            process.nextTick(() => {
                console.log(profile);
                return done(null, profile);
            });
        }
    )
);