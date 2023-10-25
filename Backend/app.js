require('./database/mysqldb');
const express = require('express');
const path = require('path');
const cors = require('cors');
// const cookieParser = require('cookie-parser')
// const bodyParser = require('body-parser');
const app = express();

app.use(express.json());
app.use(cors());
// app.use(cookieParser());
require('dotenv').config({
    path: path.join(__dirname, `.env.${process.env.NODE_ENV || 'development'}`)
});

const signUpRouter = require('./routes/auth/singUp.route')
const loginRouter = require('./routes/auth/login.route')
const sellRouter = require('./routes/auth/sell.route')
const facebook = require('./routes/auth/facebook.route')
const linkedinRouter = require('./routes/auth/linkedin.route')
const instgramRouter = require('./routes/auth/instagram.route')
const serviceRouter = require('./routes/auth/service.route')
const resetpass = require('./routes/auth/resetPass.route')
const googleRouter = require('./routes/auth/google.route')

app.use('/api', signUpRouter);
app.use('/api', loginRouter)
app.use('/api', sellRouter)
app.use('/api', facebook)
app.use('/api', serviceRouter)
app.use('/api', resetpass)
app.use('/', googleRouter)

app.use('/api', linkedinRouter)
app.use('/api', instgramRouter)


app.listen(process.env.PORT,
    async () => {
        console.log("Server is up and listening on port : " + process.env.PORT);
    }
);
