require('./database/mysqldb');
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
require('dotenv').config({
    path: path.join(__dirname, `.env.${process.env.NODE_ENV || 'development'}`)
});
const signUpRouter = require('./routes/auth/singUp.route')
const loginRouter = require('./routes/auth/login.route')
const sellRouter = require('./routes/auth/sell.route')
const facebook = require('./routes/auth/facebook.route')
const linkedinRouter = require('./routes/auth/linkedin.route')
const instgramRouter = require('./routes/auth/instagram.route')
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', signUpRouter);
app.use('/api', loginRouter)
app.use('/api', sellRouter)
app.use('/api', facebook)
app.use(linkedinRouter)
app.use(instgramRouter)
app.get("/", (req, res) => {
    console.log(req.user, '---------------');
    if (req.user) {
        const name = req.user.name.givenName;
        const family = req.user.name.familyName;
        const photo = req.user.photos[0].value;
        const email = req.user.emails[0].value;
        res.send(
            `<center style="font-size:140%"> <p>User is Logged In </p>
        <p>Name: ${name} ${family} </p>
        <p> Linkedn Email: ${email} </p>    
        <img src="${photo}"/>
        </center>
        `
        )
    } else {
        res.send(`<center style="font-size:160%"> <p>This is Home Page </p>
      <p>User is not Logged In</p>
      <img style="cursor:pointer;"  onclick="window.location='/auth/linkedIn'" src="http://www.bkpandey.com/wp-content/uploads/2017/09/linkedinlogin.png"/>
      </center>
      `);
    }
});

app.listen(process.env.PORT,
    async () => {
        console.log("Server is up and listening on port : " + process.env.PORT);
    }
);
