const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const express = require('express');
const axios = require('axios');

const facebookRouter = express.Router();


// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: 'YOUR_FACEBOOK_CLIENT_ID',
    clientSecret: 'YOUR_FACEBOOK_CLIENT_SECRET',
    callbackURL: 'YOUR_FACEBOOK_CALLBACK_URL',
    profileFields: ['id', 'emails', 'name'] // Specify required user fields
}, (accessToken, refreshToken, profile, done) => {
    // Use 'profile' to handle user details
    return done(null, profile);
}));

// LinkedIn Strategy
passport.use(new LinkedInStrategy({
    clientID: 'YOUR_LINKEDIN_CLIENT_ID',
    clientSecret: 'YOUR_LINKEDIN_CLIENT_SECRET',
    callbackURL: 'YOUR_LINKEDIN_CALLBACK_URL',
    scope: ['r_liteprofile'] // Specify required scopes
}, (token, tokenSecret, profile, done) => {
    // Use 'profile' to handle user details
    return done(null, profile);
}));

// Twitter Strategy
passport.use(new TwitterStrategy({
    consumerKey: 'YOUR_TWITTER_API_KEY',
    consumerSecret: 'YOUR_TWITTER_API_SECRET',
    callbackURL: 'YOUR_TWITTER_CALLBACK_URL'
}, (token, tokenSecret, profile, done) => {
    // Use 'profile' to handle user details
    return done(null, profile);
}));

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Facebook Login Route
facebookRouter.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook Callback Route
facebookRouter.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/success',
    failureRedirect: '/error'
}));

// LinkedIn Login Route
facebookRouter.get('/auth/linkedin', passport.authenticate('linkedin'));

// LinkedIn Callback Route
facebookRouter.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
    successRedirect: '/success',
    failureRedirect: '/error'
}));

// Twitter Login Route
facebookRouter.get('/auth/twitter', passport.authenticate('twitter'));

// Twitter Callback Route
facebookRouter.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/success',
    failureRedirect: '/error'
}));

// Route for successful authentication
facebookRouter.get('/success', (req, res) => {
    res.send('Successfully logged in');
});

// Route for failed authentication
facebookRouter.get('/error', (req, res) => {
    res.send('Failed to log in');
});

module.exports = facebookRouter;
