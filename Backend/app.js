const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const connection = require('./database/mysqldb')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;

require('dotenv').config({
    path: path.join(__dirname, `.env.${process.env.NODE_ENV || 'development'}`)
});

require('./database/mysqldb');
const signUpRouter = require('./routes/auth/singUp.route')
const loginRouter = require('./routes/auth/login.route')
const sellRouter = require('./routes/auth/sell.route')
// const facebook = require('./routes/auth/facebook.route')
const app = express();

// Middleware
app.use(express.json());
app.use(cors());


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', signUpRouter);
app.use('/api', loginRouter)
app.use('/api', sellRouter)
// app.use('/api', facebook)
app.use(session({
    secret: 'jsonworldplaceforjsdemos',
    saveUninitialized: false, // Set to false to prevent saving uninitialized sessions
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
    clientID: "2708969762574726",
    clientSecret: "25b09c2150786774e096b506a2362b07",
    callbackURL: "http://localhost:5000/auth/facebook/callback",
},
    function (accessToken, refreshToken, profile, done) {
        console.log('accessToken', accessToken);
        console.log("refreshToken", refreshToken);
        console.log(profile.displayName, '-------------------', profile.emails, profile);
        process.nextTick(function () {

            connection.query("SELECT * FROM test.tbl_user WHERE name = '" + profile.displayName + "'",
                function (err, rows, fields) {
                    if (err) throw err;
                    if (rows.length === 0) {
                        console.log("There is a new user, registering here");
                        connection.query("INSERT INTO test.tbl_user(name, email,mobile_number,provider) VALUES('" + profile.displayName + "', 'abc@gmail.com','8985744525','" + profile.provider + "')");

                        console.log(profile);
                        return done(null, profile);
                    }
                    else {
                        console.log("User already registered in database...");
                        return done(null, profile);
                    }
                });
        });
    }));

app.get('/', (req, res) => {
    console.log(req.username, '---');
    console.log(req.emails)
    console.log(req.id);
    res.render('index', { user: req.user });
});

app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }),
    (req, res) => {
        console.log(req.emails);
        console.log(req.username);
        res.redirect('/');
    });



app.listen(process.env.PORT,
    async () => {
        console.log("Server is up and listening on port : " + process.env.PORT);
    }
);
