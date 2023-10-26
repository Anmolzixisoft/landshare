const session = require('express-session');
const express = require('express')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;

const connection = require('../database/mysqldb')
const app = express()


// app.use(session({
//     secret: 'jsonworldplaceforjsdemos',
//     saveUninitialized: false,
// }));
app.use(session({
    secret: '344529d1910586669f27bbee07f0c80c',
    resave: false,
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
    clientID: "1351807122090160",
    clientSecret: "344529d1910586669f27bbee07f0c80c",
    callbackURL: "http://api.landshareindia.com:5000/api/auth/facebook/callback",
},
  async function (accessToken, refreshToken, profile, done) {
    console.log("accessToken =>", accessToken)
    console.log("profile =>", profile);
        process.nextTick(function () {

            connection.query("SELECT * FROM landsharein_db.tbl_user WHERE socialid = '" + profile.id + "'",
                function (err, rows, fields) {
                    if (err) throw err;
                    if (rows.length === 0) {
                        console.log("There is a new user, registering here");
                        connection.query("INSERT INTO landsharein_db.tbl_user(name, email,mobile_number,provider,socialid) VALUES('" + profile.displayName + "', 'abc@gmail.com','8985744525','" + profile.provider + "','" + profile.id + "')");

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