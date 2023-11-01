const express = require('express')
// const session = require('express-session');
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;

const connection = require('../database/mysqldb')
const app = express()

app.use(require('express-session')({ 
    secret: '0ef2e6264ea26ff957af201d634481de',
    resave: true,
    saveUninitialized: true
  }));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: "1023394168971960",
    clientSecret: "37ae69dca87e50e1b8e04815f10ca93f",
    callbackURL: "http://api.landshareindia.com:5000/api/auth/facebook/callback",
}, async function (accessToken, refreshToken, profile, done) {
    try {
        console.log("profile =>", profile);
        process.nextTick(function () {
            connection.query("SELECT * FROM landsharein_db.tbl_user WHERE socialid = '" + profile.id + "'", function (err, rows, fields) {
                if (err) {
                    throw err; // Error handling using throw
                }
                if (rows.length === 0) {
                    console.log("There is a new user, registering here");
                    connection.query("INSERT INTO landsharein_db.tbl_user(name, email, mobile_number, provider, socialid) VALUES('" + profile.displayName + "', 'abc@gmail.com', '8985744525', '" + profile.provider + "', '" + profile.id + "')");
                    return done(null, profile);
                } else {
                    console.log("User already registered in the database...");
                    return done(null, profile);
                }
            });
        });
    } catch (error) {
        console.error("An error occurred:", error);
        return done(error, null);
    }
}));






