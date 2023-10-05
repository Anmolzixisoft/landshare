var Instagram = require('passport-instagram');
const InstagramStrategy = Instagram.Strategy;
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
    new InstagramStrategy(
        {
            clientID: "1069108724005842",
            clientSecret: "7e2d49ab1ce8936eba7744eff1579f62",
            callbackURL: "https://localhost:5000/auth/instagram/callback"
        },
        (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => {
                console.log(profile);
                return done(null, profile);
            });
        }))