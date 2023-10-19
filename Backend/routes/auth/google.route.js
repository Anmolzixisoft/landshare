

const express = require('express');
const googleRouter = express.Router();
const passport = require('passport');
const cors = require('cors');

const session = require('express-session');
const cookieParser = require('cookie-parser')
const app = express()
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.set('view engine', 'ejs');

const start = require('../../controllers/google.controller')

googleRouter.get('/', (req, res) => {
    res.redirect('http://127.0.0.1:5500/Frontend/index.html');
    // res.render('google.ejs');

});

googleRouter.use(session({
    secret: 'jsonworldplaceforjsdemos',
    saveUninitialized: false,
}));
googleRouter.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })

);

googleRouter.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {

        res.redirect('/');
        // console.log('User Profile:', req.user[0].id, req.user[0].email); 
        // res.send({
        //     'userId': req.user[0].id,
        //     'username': req.user[0].email
        // })
        // if (req.isAuthenticated()) {
        //     // User is authenticated, send the user data in the response
        //     const userData = {
        //         userId: req.user[0].id, // Modify this to match your user data structure
        //         email: req.user[0].email // Modify this to match your user data structure
        //     };

        //     res.status(200).json(userData);
        // } else {
        //     // Authentication failed, you can handle this case as needed
        //     res.status(401).json({ message: 'Authentication failed' });
        // }
    });



module.exports = googleRouter;
