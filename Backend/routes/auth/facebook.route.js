

const express = require('express');
const facebookRouter = express.Router();
const passport = require('passport');
const cors = require('cors');

const session = require('express-session');
const cookieParser = require('cookie-parser')
const app = express()
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.set('view engine', 'ejs');

const start = require('../../controllers/facebook')
facebookRouter.get('/', (req, res) => {
    console.log('--------');
    res.render('index.ejs');
});
facebookRouter.use(session({
    secret: 'jsonworldplaceforjsdemos',
    saveUninitialized: false,
}));

facebookRouter.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

facebookRouter.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/api', failureRedirect: '/login' }),
    (req, res) => {
        console.log(req.emails);
        console.log(req.username);
        res.redirect('/api');
    });


module.exports = facebookRouter;
