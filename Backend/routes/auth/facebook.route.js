const jwt = require('jsonwebtoken');


const express = require('express');
const facebookRouter = express.Router();
const passport = require('passport');
const cors = require('cors');
const connection = require('../../database/mysqldb')
const cookieParser = require('cookie-parser')
const app = express()
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.set('view engine', 'ejs');

const start = require('../../controllers/facebook')
facebookRouter.get('/', (req, res) => {
    res.redirect('http://127.0.0.1:5500/Frontend/index.html', req.user);
});

facebookRouter.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

facebookRouter.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
        var userData = {}

        if (req.user[0] == undefined) {
            connection.query(
                `SELECT * FROM landsharein_db.tbl_user WHERE provider = 'facebook' ORDER BY id DESC LIMIT 1`,
                (err, result) => {
                    if (err) {
                        return res.send({ error: err });
                    } else {
                        if (result.length > 0) {

                            userData = {
                                'userId': result[0].id,
                                'username': result[0].email
                            };
                        }
                        const token = jwt.sign(userData, 'secret-key');

                        res.redirect(`http://127.0.0.1:5500/Frontend/index.html?token=${token}&userId=${result[0].id}`);

                    }
                }
            );
        } else {

            userData = {
                'userId': req.user[0].id,
                'username': req.user[0].email
            };
            const token = jwt.sign(userData, 'secret-key');

            res.redirect(`http://127.0.0.1:5500/Frontend/index.html?token=${token}&userId=${req.user[0].id}`);
        }

    });



module.exports = facebookRouter;
