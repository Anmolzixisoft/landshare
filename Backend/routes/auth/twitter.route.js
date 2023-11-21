const express = require('express');
const session = require('express-session');
const oauth = require('oauth');
const twitterRouter = express.Router();
const connection = require('../../database/mysqldb');
var Twitter = require("node-twitter-api")
const jwt = require('jsonwebtoken');
const secretKey = "hellomanufacturelogin";

const API_KEY = 'RzwPbtRBqdK1hAuecdc0Kv0QJ';
const API_SECRET_KEY = 'wYf45BqofUy1duWgilf9ta8eD2ECoqT9Kooy2wZ69YLhL9PnDJ';
const accessToken = '1709447157215121408-6FpVhC4f7dNMC4uiP8UHXaK4CYID1x'
const accessTokenSecret = '9FnyiGqKsfsD4GXT6mcqCwzY4kfcAXMiFriUl2heZXa1E'
const REDIRECT_URI = 'https://api.landshareindia.com:5000/api/auth/twitter/callback';

twitterRouter.use(session({ secret: 'SECRET', resave: true, saveUninitialized: true }));

const twitterOAuth = new oauth.OAuth(
    'https://twitter.com/oauth/request_token',
    'https://twitter.com/oauth/access_token',
    API_KEY,
    API_SECRET_KEY,
    '1.0A',
    REDIRECT_URI,
    'HMAC-SHA1'
);

const twitter = new Twitter({
    consumerKey: API_KEY,
    consumerSecret: API_SECRET_KEY,
    callback: REDIRECT_URI
});

twitterRouter.get('/auth/twitter', (req, res) => {
    twitter.getRequestToken((error, oauthToken, oauthTokenSecret) => {
        if (error) {
            return res.status(500).send('Error getting OAuth request token');
        }
        req.session.oauth = req.session.oauth || {};
        req.session.oauth.token = oauthToken;
        req.session.oauth.token_secret = oauthTokenSecret;
        res.redirect(`https://twitter.com/oauth/authenticate?oauth_token=${oauthToken}`);
    });
});


twitterRouter.get('/auth/twitter/callback', (req, res) => {
    const requestToken = req.query.oauth_token;
    const verifier = req.query.oauth_verifier;

    twitter.getAccessToken(requestToken, req.session.oauth.token_secret, verifier, (err, accessToken, accessSecret) => {
        if (err) {
            res.status(500).send(err);
        } else {
            // Use the obtained access tokens (accessToken, accessSecret) for making Twitter API requests
            twitter.verifyCredentials(accessToken, accessSecret, {}, (err, user) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    connection.query("SELECT * FROM tbl_user WHERE email = '" + user.screen_name + "'",
                        function (err, rows, fields) {
                            if (err) throw err;
                            if (rows[0] == undefined) {
                                connection.query('SELECT MAX(User_ID) as latestUser FROM tbl_user', (err, result) => {
                                    if (err) {
                                        console.error('Error fetching latest User_ID: ' + err);
                                        return res.status(500).json({ error: 'Error fetching latest User_ID', status: false });
                                    } else {
                                        let latestUser = result[0].latestUser || 'LS1000';

                                        const numericPart = parseInt(latestUser.substring(2));
                                        const incrementedNumericPart = numericPart + 1;

                                        const newUser_ID = 'LS' + incrementedNumericPart.toString().padStart(4, '0');
                                        connection.query('INSERT INTO  tbl_user(name, profile_image, email, socialid, User_ID) VALUES(?,?,?,?,?)', [user.name, user.profile_image_url_https, user.screen_name, user.id, newUser_ID], (error, linkedinLogin) => {
                                            if (error) {
                                                return res.status(200).json({ error: true, message: `${error}`, data: null });
                                            }
                                            if (linkedinLogin.affectedRows === 1) {
                                                const id = linkedinLogin.insertId;
                                                var token = jwt.sign({ userId: id }, secretKey);
                                                return res.redirect(`http://localhost/landshare/Frontend/index.html?token=${token}&userId=${linkedinLogin.insertId}`)
                                            } else {
                                                return res.status(200).json({ error: true, message: "Not successfully linkedin login", data: null });
                                            }
                                        });
                                    };
                                })
                            }
                            else {
                                const id = rows[0].id;
                                var token = jwt.sign({ userId: id }, secretKey);
                                return res.redirect(`http://localhost/landshare/Frontend/index.html?token=${token}&userId=${rows[0].id}`)
                            }
                        });
                }
            });
        }
    });
});

module.exports = twitterRouter;