const passport = require('passport');
const jwt = require('jsonwebtoken');

const session = require('express-session')
const express = require('express')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const connection = require('../database/mysqldb')
const app = express()

app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');
app.use(session({
    secret: '05d6bebac87c48e3e5e4ece64ff357d49637586c00ee38aa5f531a0fc2918eb7',
    resave: false,
    saveUninitialized: false,
  }));
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: '831162901965-7fhm18uter8glqava4t5htph2v5feik4.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://api.landshareindia.com:5000/auth/google/callback',
},

    function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            connection.query("SELECT * FROM  landsharein_db.tbl_user WHERE socialid = '" + profile.id + "'",
                function (err, rows, fields) {
                    if (err) throw err;
                    if (rows.length == 0) {
                        console.log("There is a new user, registering here");
                        connection.query("INSERT INTO  landsharein_db.tbl_user(name, email,mobile_number,provider,socialid) VALUES('" + profile.displayName + "', '" + profile.emails[0].value + "','8985744525','" + profile.provider + "','" + profile.id + "')");
                        const payload = {
                            userId: profile.id,
                            email: profile.emails[0].value
                        };
                        const token = jwt.sign(payload, 'secret-key');
                        return done(null, profile, token);
                    }
                    else {
                        const payload = {
                            userId: rows.id,
                            email: rows.email
                        };
                        const token = jwt.sign(payload, 'secret-key');
                        console.log("User already registered in database...");
                        return done(null, rows, token);

                    }
                });
        });
    }));
