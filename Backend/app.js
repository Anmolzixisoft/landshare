const express = require('express');
const path = require('path');
const cors = require('cors');

require('dotenv').config({
    path: path.join(__dirname, `.env.${process.env.NODE_ENV || 'development'}`)
});

require('./database/mysqldb');
const signUpRouter = require('./routes/auth/singUp.route')
const loginRouter = require('./routes/auth/login.route')
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.use('/api',signUpRouter);
app.use('/api',loginRouter)

app.listen(process.env.PORT,
    async () => {
        console.log("Server is up and listening on port : " + process.env.PORT);
    }
);
