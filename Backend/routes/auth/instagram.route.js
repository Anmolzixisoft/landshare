

const express = require('express');
const instgramRouter = express.Router();
const passport = require('passport');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const app = express()
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.set('view engine', 'ejs');
const instgram = require('../../controllers/instagram.controller')

app.get('/auth/instagram', passport.authenticate('instagram'));
app.get(
  '/auth/instagram/callback',
  passport.authenticate('instagram', {
    successRedirect: '/profile',
    failureRedirect: '/login'
  })
);


module.exports = instgramRouter;
