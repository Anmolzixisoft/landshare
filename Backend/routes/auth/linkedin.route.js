

const express = require('express');
const linkedinRouter = express.Router();
const passport = require('passport');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const app = express()
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.set('view engine', 'ejs');
const linkedin = require('../../controllers/linkedin.controller')

linkedinRouter.get(
    "/auth/linkedin",
    passport.authenticate("linkedin", { state: "SOME STATE" })
);


linkedinRouter.get(
    "/auth/linkedin/callback",
    passport.authenticate("linkedin", {
        successRedirect: "/",
        failureRedirect: "/login",
    })
);



module.exports = linkedinRouter;
