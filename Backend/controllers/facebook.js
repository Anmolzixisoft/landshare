// const passport = require('passport');
// const express = require('express')
// const FacebookStrategy = require('passport-facebook').Strategy;
// const app = express();

// app.use(passport.initialize());
// app.use(passport.session());
// function loginFacebook(req, res) {

//     console.log('api run');
//     passport.serializeUser((user, done) => {
//         console.log(user, '00000000000000');
//         done(null, user);
//     });

//     passport.deserializeUser((obj, done) => {
//         console.log('11111', obj);
//         done(null, obj);
//     });
//     passport.use(new FacebookStrategy({
//         clientID: '2708969762574726',
//         clientSecret: '25b09c2150786774e096b506a2362b07',
//         callbackURL: 'http://localhost:5000/',
//         profileFields: ['id', 'displayName', 'photos', 'email']
//     }, (accessToken, refreshToken, profile, done) => {
//         // Handle user authentication and database interaction here
//         console.log('55555555');
//         console.log(accessToken, refreshToken, profile);
//         return done(null, profile);
//     }));

//     console.log('9');
// }
// function loginFacebookCallback(req, res) {
//     const user = req.user;
//     // res.redirect('/dashboard');
//     console.log(user, 'user');
// };

// // Export the passport configuration
// module.exports = { loginFacebook, loginFacebookCallback };
const Sequelize = require('sequelize');
const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');

//facebookToken is the custom name of facebookstrategy
//FACEBOOK_APP_ID and FAEBOOK_APP_SECRET are set in .env file
function loginFacebook(req, res) {
    passport.use(
        'facebookToken',
        new FacebookTokenStrategy(
            {
                clientID: '2708969762574726',
                clientSecret: '25b09c2150786774e096b506a2362b07',
            },
            async (accessToken, refreshToken, profile, done, res) => {
                console.log(`inside facebook strategy`);
                //log to view the profile email
                console.log(`profile email: ${profile.emails[0].value}`);

            }
        )
    );
}
module.exports = { loginFacebook };