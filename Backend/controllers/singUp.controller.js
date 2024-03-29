const connection = require('../database/mysqldb')
var nodemailer = require('nodemailer');

const bcrypt = require('bcrypt');
var transporter = nodemailer.createTransport({
    host: "tls://smtp.gmail.com",
    service: 'gmail',
    port: 587,
    auth: {
        user: 'anmolrajputzixisoft@gmail.com',
        pass: 'drqy nyew vhaw zvxx',
    }
});

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
            if (err) {
                return res.send({ data: err, status: false })
            } else {
                result.forEach(element => {
                    element.profile_image = `http://192.168.29.179:5501/Backend/public/${element.profile_image}`;
                });

                return res.send({ data: result, status: true })
            }
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
            'SELECT otp  FROM landsharein_db.tbl_user WHERE otp = ? ',
            [otp],
            (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Database error' });
                }
                const user = result[0]
                if (!user) {
                    return res.send({ error: "invalid otp" })
                }

                bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
                    if (hashErr) {
                        console.error('Password hashing failed: ' + hashErr);
                        return res.status(500).json({ error: 'Internal server error', status: false });
                    }
                    connection.query(
                        `UPDATE landsharein_db.tbl_user SET name=?, mobile_number=?,password_bcrypt=?, password=? WHERE otp=?`,
                        [name, mobile_number, password, hashedPassword, otp],
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
    console.log(otp, 'otp');
    const mailOptions = {
        from: 'anmolrajputzixisoft@gmail.com',
        to: email,
        subject: "SignUp OTP",
        text: ` OTP code is: ${otp}`
    };

    connection.query(
        'SELECT * FROM landsharein_db.tbl_user WHERE email = ? ',
        [email],
        (err, results) => {
            if (err) {
                console.error('Error checking email existence: ' + err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (results.length > 0) {
                connection.query(
                    `UPDATE landsharein_db.tbl_user SET otp=? WHERE email=?`,
                    [otp, email],
                    (err, result1) => {
                        if (err) {
                            console.error('Update error:', err);
                            return res.status(500).json({ error: 'Update error' });
                        }
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log('------------------', error);
                            } else {
                                console.log('Email sent: ');
                            }
                        })
                        return res.status(201).json({ data: result1, status: true, msg: `sent mail successful ${otp}` });
                    }
                );
            } else {
                // Determine the latest User_ID
                connection.query('SELECT MAX(User_ID) as latestUser FROM landsharein_db.tbl_user', (err, result) => {
                    if (err) {
                        console.error('Error fetching latest User_ID: ' + err);
                        return res.status(500).json({ error: 'Error fetching latest User_ID', status: false });
                    } else {
                        let latestUser = result[0].latestUser || 'LS1000';


                        const numericPart = parseInt(latestUser.substring(2));
                        const incrementedNumericPart = numericPart + 1;

                        const newUser_ID = 'LS' + incrementedNumericPart.toString().padStart(4, '0');

                        connection.query(
                            'INSERT INTO landsharein_db.tbl_user (User_ID, name, email, mobile_number,password_bcrypt, password, otp) VALUES (?, ?, ?, ?,?, ?, ?)',
                            [newUser_ID, "", email, "", "", "", otp],
                            (insertErr, insertResult) => {
                                if (insertErr) {
                                    console.error('Error inserting data: ' + insertErr);
                                    return res.status(500).json({ error: 'Error inserting data', status: false });
                                } else {
                                    transporter.sendMail(mailOptions, function (error, info) {
                                        if (error) {
                                            console.log('Email error: ' + error);
                                        } else {
                                            console.log('Email sent: ' + info.response);
                                        }
                                    });
                                    return res.status(201).json({ data: insertResult, status: true, msg: `Sent mail successful ${otp}` });
                                }
                            }
                        );
                    }
                });

            }
        }
    );


}

function getuserbyid(req, res) {
    try {
        const { userid } = req.body
        connection.query('select * from landsharein_db.tbl_user where id= "' + userid + '" ', (err, result) => {
            if (err) {
                return res.send({ error: err })
            } else {
                result.forEach(element => {
                    element.profile_image = `http://192.168.29.179:5500/Backend/public/${element.profile_image}`;
                });
                return res.send({ message: result })
            }
        })
    } catch (err) {
        return res.send({ error: err })
    }
}
function updateuser(req, res) {
    try {
        const { name, email, mobile_number, password, id, request_update } = req.body;
        const { profile_image } = req.files

        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format', status: false });
        }

        if (!isValidMobileNumber(mobile_number)) {
            return res.status(400).json({ error: 'Invalid mobile number format', status: false });
        }

        connection.query(
            'SELECT id, password FROM landsharein_db.tbl_user WHERE id = "' + id + '" ',
            (err, result) => {

                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }
                const user = result[0];
                if (!user) {
                    return res.send({ error: "User not found" });
                }

                var hashedPassword = user.password;

                if (password !== "") {
                    bcrypt.hash(password, 10, (hashErr, newHashedPassword) => {
                        if (hashErr) {
                            console.error('Password hashing failed: ' + hashErr);
                            return res.status(500).json({ error: 'Internal server error', status: false });
                        }
                        hashedPassword = newHashedPassword;

                        updateProfile(name, email, mobile_number, hashedPassword, password, id, request_update, profile_image, res);
                    });
                } else {
                    updateProfile(name, email, mobile_number, hashedPassword, password, id, request_update, profile_image, res);
                }
            });
    } catch (err) {
        console.log(err, 'err');
        return res.send({ error: err });
    }
}

function updateProfile(name, email, mobile_number, hashedPassword, password, id, request_update, profile_image, res) {


    var image = '';
    if (typeof profile_image !== 'undefined') {
        image = '`Image` = "' + profile_image[0].filename + '" ';
    }

    if (profile_image) {

        image = profile_image[0].filename
        const sql = 'UPDATE landsharein_db.tbl_user SET name=?, mobile_number=?, password=?, password_bcrypt=?, email=? , profile_image=? WHERE id= ?'

        connection.query(
            sql, [name, mobile_number, hashedPassword, password, email, image, id],
            (err, result1) => {
                if (err) {
                    console.error('Update error:', err);
                    return res.status(500).json({ error: 'Update error' });
                }

                return res.status(200).json({ success: true, message: 'Profile updated success' });
            }
        );
    }
    else {

        const sql = 'UPDATE landsharein_db.tbl_user SET name=?, mobile_number=?, password=?, password_bcrypt=?, email=? ' + image + ' WHERE id= ?'

        connection.query(
            sql, [name, mobile_number, hashedPassword, password, email, id],
            (err, result1) => {
                if (err) {
                    console.error('Update error:', err);
                    return res.status(500).json({ error: 'Update error' });
                }

                return res.status(200).json({ success: true, message: 'Profile updated success' });
            }
        );
    }

}

function adminupdateuser(req, res) {
    try {
        const { email, mobile_number, id } = req.body;

        console.log(email);
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format', status: false });
        }

        if (!isValidMobileNumber(mobile_number)) {
            return res.status(400).json({ error: 'Invalid mobile number format', status: false });
        }

        connection.query(
            'SELECT id FROM landsharein_db.tbl_user WHERE id = "' + id + '" ',
            (err, result) => {

                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }
                const user = result[0];
                if (!user) {
                    return res.send({ error: "User not found" });
                }
                var image = '';
                if (typeof profile_image !== 'undefined') {
                    image = ', `Image` = "' + profile_image[0].filename + '" ';
                }


                const sql = 'UPDATE landsharein_db.tbl_user SET  mobile_number=?,request_update="0", email=? ' + image + ' WHERE id= ?'


                const notification = `UPDATE landsharein_db.tbl_notificatin
                SET notification_count = 0
                WHERE id = 1;`
                connection.query(notification, (err, notificationdata) => {
                    console.log(notification);
                    if (err) {
                        console.error('Update error:', err);
                        return res.status(500).json({ error: 'Update error' });
                    } 
                })

                connection.query(
                    sql, [mobile_number, email, id],
                    (err, result1) => {
                        if (err) {
                            console.error('Update error:', err);
                            return res.status(500).json({ error: 'Update error' });
                        }

                        return res.status(200).json({ success: true, message: 'Profile updated success' });
                    }
                );


            });
    } catch (err) {
        console.log(err, 'err');
        return res.send({ error: err });
    }
}

function getalluser(req, res) {
    connection.query('select * from landsharein_db.tbl_user ', (err, result) => {
        if (err) {
            return res.send({ error: err })
        }
        else {
            return res.send({ message: result })
        }
    })
}

function deleteuser(req, res) {
    const { userid } = req.body
    connection.query('select * from landsharein_db.tbl_user WHERE id = "' + userid + '"', (err, result) => {
        if (err) {
            return res.send({ error: err })
        }
        if (result.length == 0) {
            return res.send({ error: "user not found " })
        }
        else {
            connection.query('DELETE FROM landsharein_db.tbl_user WHERE id = "' + userid + '"', (err, result) => {
                if (err) {
                    return res.send({ error: err })
                }
                else {
                    return res.send({ message: "delete " })
                }
            })
        }
    })

}

function blockuser(req, res) {
    const { userid, status } = req.body
    connection.query('select * from landsharein_db.tbl_user WHERE id="' + userid + '" ', (err, result) => {
        if (err) {
            return res.send({ error: err }
            )
        }
        if (result.length == 0) {
            return res.send({ error: "not found " })
        }
        else {
            connection.query('UPDATE landsharein_db.tbl_user SET status="' + status + '"  where id="' + userid + '"', (err, result) => {
                if (err) {
                    return res.send({ error: err })
                }
                else {
                    return res.send({ message: "succesfully" })
                }
            })

        }
    })
}


function createuserbyadmin(req, res) {
    try {

        const { name, email, mobile_number, password } = req.body

        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format', status: false });
        }

        if (!isValidMobileNumber(mobile_number)) {
            return res.status(400).json({ error: 'Invalid mobile number format', status: false });
        }
        connection.query('SELECT MAX(User_ID) as latestUser FROM landsharein_db.tbl_user', (err, result) => {
            if (err) {
                console.error('Error fetching latest User_ID: ' + err);
                return res.status(500).json({ error: 'Error fetching latest User_ID', status: false });
            } else {

                var latestUser = result[0].latestUser || 'LS1000';
                connection.query(
                    'SELECT otp  FROM landsharein_db.tbl_user WHERE email = ? ',
                    [email],
                    (err, result) => {
                        if (err) {
                            console.error('Database error:', err);
                            return res.status(500).json({ error: 'Database error' });
                        }
                        const user = result[0]
                        if (user) {
                            return res.send({ message: "already exist email" })
                        }

                        bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
                            if (hashErr) {
                                console.error('Password hashing failed: ' + hashErr);
                                return res.status(500).json({ error: 'Internal server error', status: false });
                            }




                            const numericPart = parseInt(latestUser.substring(2));
                            const incrementedNumericPart = numericPart + 1;

                            const newUser_ID = 'LS' + incrementedNumericPart.toString().padStart(4, '0');
                            connection.query(
                                `INSERT INTO landsharein_db.tbl_user (User_ID,name, mobile_number, password_bcrypt, password, email,provider) VALUES (?,?, ?, ?, ?, ?,'admin')`,
                                [newUser_ID, name, mobile_number, password, hashedPassword, email],
                                (err, result) => {
                                    if (err) {
                                        console.error('Insert error:', err);
                                        return res.status(500).json({ error: 'Insert error' });
                                    }

                                    return res.status(200).json({ success: true, message: 'User Added successfully' });
                                }
                            );

                        }

                        );
                    });
            }
        });
    }
    catch (error) {
        return res.send({ error: error })
    }
}


function requestupdatenumber(req, res) {
    try {
        const { userid } = req.body
        const notification = `UPDATE landsharein_db.tbl_notificatin
        SET notification_count = notification_count + 1
        WHERE id = 1;`
        connection.query(notification, (err, notificationdata) => {
            console.log(notification);
            if (err) {
                console.error('Update error:', err);
                return res.status(500).json({ error: 'Update error' });
            }
        })
        connection.query(
            'UPDATE landsharein_db.tbl_user SET request_update="1" WHERE id="' + userid + '"',
            (err, result1) => {
                if (err) {
                    console.error('Update error:', err);
                    return res.status(500).json({ error: 'Update error' });
                }

                return res.status(200).json({ success: true, message: 'req.. successfully send' });
            }
        );
    } catch (error) {
        return res.send({ error: error })
    }

}

module.exports = { signUp, getuser, sendVerificationMail, getuserbyid, updateuser, getalluser, deleteuser, blockuser, createuserbyadmin, requestupdatenumber, adminupdateuser }


