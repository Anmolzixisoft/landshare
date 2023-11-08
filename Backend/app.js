require('./database/mysqldb');
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const app = express();

app.use(express.json());
app.use(cors());
require('dotenv').config({
    path: path.join(__dirname, `.env.${process.env.NODE_ENV || 'development'}`)
});
const options = {
    key: fs.readFileSync('./sslKey/privatekey.key'), // Replace with your private key file path
    cert: fs.readFileSync('./sslKey/certificate.crt'), // Replace with your certificate file path
};

const adminRouter = require('./routes/auth/admin.route');
const signUpRouter = require('./routes/auth/singUp.route')
const loginRouter = require('./routes/auth/login.route')
const sellRouter = require('./routes/auth/sell.route')
const facebook = require('./routes/auth/facebook.route')
const linkedinRouter = require('./routes/auth/linkedin.route')
const instgramRouter = require('./routes/auth/instagram.route')
const serviceRouter = require('./routes/auth/service.route')
const resetpass = require('./routes/auth/resetPass.route')
const googleRouter = require('./routes/auth/google.route')
const twitterRouter = require('./routes/auth/twitter.route')
app.use('/api', adminRouter);
app.use('/api', signUpRouter);
app.use('/api', loginRouter)
app.use('/api', sellRouter)
app.use('/api', facebook)
app.use('/api', serviceRouter)
app.use('/api', resetpass)
app.use('/', googleRouter)

app.use('/api', linkedinRouter)
app.use('/api', instgramRouter)
app.use('/api', twitterRouter)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
})
app.get('/', (req, res) => {
    return res.send({ data: "runnning" })
})
// app.use(stormpath.init(app, {
//     application: 'https://api.stormpath.com/v1/applications/xxx',
//     secretKey: '0e48affa657030f6b1579ce75d0a30fe85fb14cc',
//     enableFacebook: true,
//     social: {
//         facebook: {
//             appId: '889033206179671',
//             appSecret: 'a1296ac680f772062a5ccdcd03ee1baf',
//         }
//     },
// }));

app.listen(process.env.PORT, () => {
    console.log("Server is up and listening on port : " + process.env.PORT);
});