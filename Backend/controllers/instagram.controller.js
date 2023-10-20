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
            clientID: "990282092080599",
            clientSecret: "c4af330155a6409a1635903db18d237b",
            callbackURL: "https://localhost:5000/auth/instagram/callback"
        },
        function (accessToken, refreshToken, profile, done) {

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

