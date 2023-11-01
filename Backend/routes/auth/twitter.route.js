const express = require('express');
const twitterRouter = express.Router();
const passport = require('passport');

const TwitterStrategy = require('passport-twitter').Strategy;

passport.use(new TwitterStrategy({
    consumerKey: 'bTVwZ1M5X0piUFhpV0UxTGcyT1o6MTpjaQ',
    consumerSecret: 'iChiAjvTmNCIvXpjwgq-ElxNr1rw8meQc9oSoUXexWpuSw2Rba',
    callbackURL: "http://127.0.0.1:5000/auth/twitter/callback"
},
    function (token, tokenSecret, profile, cb) {
        console.log(profile);
        User.findOrCreate({ twitterId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));
twitterRouter.get('/auth/twitter',
    passport.authenticate('twitter'));

twitterRouter.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

module.exports = twitterRouter;
