const session = require('express-session')
const express = require('express')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;

const connection = require('../database/mysqldb')
const app = express()


app.use(session({
    secret: 'jsonworldplaceforjsdemos',
    saveUninitialized: false,
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
    clientID: "2708969762574726",
    clientSecret: "25b09c2150786774e096b506a2362b07",
    callbackURL: "http://localhost:5000/api/auth/facebook/callback",
},
    function (accessToken, refreshToken, profile, done) {

        process.nextTick(function () {

            connection.query("SELECT * FROM test.tbl_user WHERE socialid = '" + profile.id + "'",
                function (err, rows, fields) {
                    if (err) throw err;
                    if (rows.length === 0) {
                        console.log("There is a new user, registering here");
                        connection.query("INSERT INTO test.tbl_user(name, email,mobile_number,provider,socialid) VALUES('" + profile.displayName + "', 'abc@gmail.com','8985744525','" + profile.provider + "','" + profile.id + "')");

                        return done(null, profile);
                    }
                    else {
                        const token = accessToken

                        console.log("User already registered in database...");
                        return done(null, profile, token);
                    }
                });
        });
    }));