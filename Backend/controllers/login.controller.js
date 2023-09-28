const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../database/mysqldb')
function login(req, res) {
    try {
        const { email, password, otp } = req.body;

        if (!email || !password || !otp) {
            return res.status(400).json({ error: 'Missing required fields', status: false });
        }

        // Query the database to retrieve the user's hashed password
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

                    console.log(user, "user");
                    return
                    bcrypt.compare(password, user.password, (bcryptErr, bcryptResult) => {
                        if (bcryptErr) {
                            console.error('Password comparison failed: ' + bcryptErr);
                            return res.send({ error: 'Password wrong', status: false });
                        }

                        if (!bcryptResult) {
                            return res.send({ error: 'Authentication failed' });
                        }

                        // Generate a JWT token for successful authentication
                        const token = jwt.sign({ userId: user.id, email: user.email }, 'secret_key', {
                            expiresIn: '1h', // Token expires in 1 hour
                        });
                        const userId = user.id
                        res.send({ msg: "login successfully", token, userId });
                    });
                }
            }
        );
    }
    catch (error) {
        console.log(error);
        return res.send({ data: error, status: false })
    }
}

module.exports = { login }