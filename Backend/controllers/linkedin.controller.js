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
app.use(session({
    secret: '05d6bebac87c48e3e5e4ece64ff357d49637586c00ee38aa5f531a0fc2918eb7',
    resave: false,
    saveUninitialized: false,
    // Other session configuration options...
  }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LinkedInStrategy({
    clientID: '77bqfuts6sx7vz',
    clientSecret: 'pFafmexY0XhfyTwy',
    callbackURL: "https://localhost:5000/api/auth/linkedin/callback",
    scope: ['r_liteprofile']

},
    function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            connection.query("SELECT * FROM  landsharein_db.tbl_user WHERE socialid = '" + profile.id + "'",
                function (err, rows, fields) {
                    if (err) throw err;
                    if (rows.length == 0) {
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
                        return done(null, rows, token);

                    }
                });
        });
    }));