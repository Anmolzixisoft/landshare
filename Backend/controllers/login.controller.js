const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../database/mysqldb')
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: "tls://smtp.gmail.com",
    service: 'gmail',
    port: 587,
    auth: {
        user: 'anmolrajputzixisoft@gmail.com',
        pass: 'drqy nyew vhaw zvxx',
    }
});
function generateOTP() {
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        otp += digits[randomIndex];
    }

    return otp;
}

function verifyByOtp(req, res) {
    try {
        const { email, otp } = req.body;

        if (!otp) {
            return res.status(400).json({ error: 'Missing required fields', status: false });
        }

        connection.query(
            'SELECT *  FROM test.tbl_user WHERE otp = ? ',
            [otp],
            (err, results) => {

                if (err) {
                    console.error('Database query failed: ' + err);
                    return res.send({ error: 'Internal server error', status: false });
                }

                if (results.length == 0) {
                    return res.send({ error: 'Otp Not Match', status: false });
                }

                if (results[0].otp != otp) {
                    return res.send({ error: 'Otp Not Match', status: false });
                }


                const user = results[0];

                const token = jwt.sign({ userId: user.id, email: user.email }, 'secret_key', {
                    expiresIn: '10h',
                });
                const userId = user.id


                res.send({ msg: "Otp Verify successfully", token: token, userId: userId });


            }
        );
    }
    catch (error) {
        console.log(error);
        return res.send({ data: error, status: false })
    }
}

function login(req, res) {
    const email = req.body.email
    const password = req.body.password
    if (!email) {
        return res.send({ error: "please fill email" })
    }

    const otp = generateOTP();
    console.log(otp, 'otp');
    const mailOptions = {
        from: 'anmolrajputzixisoft@gmail.com',
        to: email,
        subject: "SignUp OTP",
        text: ` OTP code is: ${otp}`
    };

    connection.query(
        'SELECT *  FROM test.tbl_user WHERE email = ?',
        [email],
        (err, results) => {

            if (err) {
                console.error('Database query failed: ' + err);
                return res.send({ error: 'Internal server error', status: false });
            }
            if (results.length == 0) {
                return res.send({ error: 'this email id not register' });
            }
            else {
                const user = results[0];


                bcrypt.compare(password, user.password, (bcryptErr, bcryptResult) => {
                    if (bcryptErr) {
                        console.error('Password comparison failed: ' + bcryptErr);
                        return res.send({ error: 'Password wrong', status: false });
                    }
                    if (!bcryptResult) {
                        return res.send({ error: 'Authentication failed' });
                    } else {
                        connection.query(
                            `UPDATE test.tbl_user SET  otp=? WHERE email=?`,
                            [otp, user.email],
                            (err, result1) => {
                                if (err) {
                                    console.error('Update error:', err);
                                    return res.status(500).json({ error: 'Update error' });
                                }
                                return res.status(200).json({ success: true, message: ' otp sent  successfully' });
                            }
                        );
                    }

                });


            }
        }
    );
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('------------------', error);
        } else {
            console.log('Email sent: ');
        }
    })
}
function facebookOAuth(req, res) {
    if (req.user.email !== null && req.user.id !== null) {
        let email = req.user.email;
        let fbid = req.user.facebookid;
        res.status(200).json({ emailid: email, facebookid: fbid })
    }
};

function getuserName(req, res) {
    const { userid } = req.body
    connection.query('SELECT name FROM test.tbl_user where id ="' + userid + '"', (err, results) => {
        if (err) {
            return res.send({ erorr: err })
        }
        else {
            return res.send({ message: results })
        }
    })
}
module.exports = { login, verifyByOtp, facebookOAuth,getuserName }