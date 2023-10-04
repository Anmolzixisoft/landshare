// const express = require('express');
// const facebook = express.Router();
// const passport = require('passport');
// const {loginFacebook} = require('../../controllers/facebook')
// // Define your route handlers here

// // Route for Facebook login
// facebook.get('/auth/facebook', passport.authenticate('facebook'));

// facebook.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));

// // Export the router
// module.exports = facebook;


const express = require('express');
const facebookRouter = express.Router();
const passport = require('passport');

const app = express()
const { loginFacebook, loginFacebookCallback } = require('../../controllers/facebook')
// Route for Facebook login
app.use(passport.initialize());
app.use(passport.session());
// facebookRouter.get('/auth/facebook', loginFacebook);
facebookRouter.get('/auth/facebook',
loginFacebook);

// Route for Facebook callback
facebookRouter.get('/auth/facebook/callback', loginFacebookCallback);

module.exports = facebookRouter;
