const connection = require('../database/mysqldb')
var nodemailer = require('nodemailer');

const bcrypt = require('bcrypt');

function isValidMobileNumber(mobile_number) {

    const mobileRegex = /^[0-9]{10}$/;

    return mobileRegex.test(mobile_number);
}
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function getuser(req, res) {
    try {
        connection.query("SELECT * FROM `tbl_user`", (err, result) => {

            return res.send({ data: result, status: true })
        })
    }
    catch (error) {
        return res.send({ data: error, status: false })
    }
}
function signUp(req, res) {
    try {
        const { name, email, mobile_number, password, otp } = req.body;
        if (!name || !email || !mobile_number || !password || !otp) {
            return res.status(400).json({ error: 'Missing required fields', status: false });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format', status: false });
        }

        if (!isValidMobileNumber(mobile_number)) {
            return res.status(400).json({ error: 'Invalid mobile number format', status: false });
        }
        connection.query(
            'SELECT otp FROM test.tbl_user WHERE otp = ?',
            [otp],
            (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Database error' });
                }

                if (result.length === 0) {
                    return res.status(404).json({ error: 'otp not found' });
                }
                bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
                    if (hashErr) {
                        console.error('Password hashing failed: ' + hashErr);
                        return res.status(500).json({ error: 'Internal server error', status: false });
                    }
                    connection.query(
                        `UPDATE test.tbl_user SET name=?, email=?, mobile_number=?, password=? WHERE otp=?`,
                        [name, email, mobile_number, hashedPassword, otp],
                        (err, result1) => {
                            if (err) {
                                console.error('Update error:', err);
                                return res.status(500).json({ error: 'Update error' });
                            }

                            return res.status(200).json({ success: true, message: 'User SignUp successfully' });
                        }
                    );
                }

                );
            });

    } catch (error) {
        console.log('update  error ->', error);
        return res.send({ data: error, status: false })
    }
}
function deleteuser(req, res) {
    try {
        const { id } = req.body
        if (!id) {
            return res.send({ data: "please enter your id", status: false })

        }
        connection.query(`select id  FROM tbl_user WHERE id = ${id}`, (err, result) => {
            if (result.length != 0) {
                connection.query(`DELETE FROM tbl_user WHERE tbl_user.id = ${id}`, (err, result1) => {
                    if (result1) {
                        return res.send({ data: result1, msg: "delete successfully", status: true })

                    }


                })

            }
            else {
                return res.send({ msg: "not exist id ", status: true })
            }
        })

    } catch (error) {
        console.log('delete task error ->', error);
        return res.send({ data: error, status: false })
    }
}
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
function sendVerificationMail(req, res) {
    const email = req.body.email
    if (!email) {
        return res.send({ error: "please fill email" })
    }

    const otp = generateOTP();
    console.log(otp, 'otpotpotp');
    const mailOptions = {
        from: 'anmolrajputzixisoft@gmail.com',
        to: email,
        subject: "SignUp OTP",
        text: ` OTP code is: ${otp}`
    };
    connection.query(
        'INSERT INTO test.tbl_user (name, email, mobile_number, password,otp) VALUES (?, ?,?, ?, ?)',
        ["", "", "", "", otp],
        (err, result) => {
            if (err) {
                console.error('Error inserting data: ' + err);
                return res.status(500).json({ error: 'Error inserting data', status: false });
            } else {
                console.log("succsessss");
                return res.status(201).json({ data: result, status: true, msg: "sent mail  successful" });
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
module.exports = { signUp, getuser, sendVerificationMail, deleteuser}
