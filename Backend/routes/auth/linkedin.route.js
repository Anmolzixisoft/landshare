const express = require('express');
const { default: axios } = require('axios');
const linkedinRouter = express.Router();
const connection = require('../../database/mysqldb');
const { Authorization, Redirect } = require('../../controllers/linkedin.controller');
const jwt = require('jsonwebtoken');
const secretKey = "hellomanufacturelogin";

linkedinRouter.get('/auth/linkedin', (req, res) => {
    const authorizationUrl = Authorization();
    return res.redirect(authorizationUrl);
});

linkedinRouter.get("/auth/linkedin/callback", async (req, res) => {
    try {
        const data = await Redirect(req.query.code); // Call the Redirect function
        if (data.access_token) {
            const apiUrl = 'https://api.linkedin.com/v2/userinfo';
            const headers = {
                'Authorization': `Bearer ${data.access_token}`,
                'Content-Type': 'application/json', // Adjust the content type as needed
            };
            axios.get(apiUrl, { headers })
                .then(response => {
                    // Handle the API response here
                    connection.query("SELECT * FROM  landsharein_db.tbl_user WHERE email = '" + response.data.email + "'",
                        function (err, rows, fields) {
                            if (err) throw err;
                            if (rows[0] == undefined) {
                                connection.query('SELECT MAX(User_ID) as latestUser FROM tbl_user', (err, result) => {
                                    if (err) {
                                        console.error('Error fetching latest User_ID: ' + err);
                                        return res.status(500).json({ error: 'Error fetching latest User_ID', status: false });
                                    } else {
                                        let latestUser = result[0].latestUser || 'LS1000';

                                        const numericPart = parseInt(latestUser.substring(2));
                                        const incrementedNumericPart = numericPart + 1;

                                        const newUser_ID = 'LS' + incrementedNumericPart.toString().padStart(4, '0');
                                        connection.query('INSERT INTO  landsharein_db.tbl_user(name, email, socialid, User_ID) VALUES(?,?,?,?)', [response.data.name, response.data.email, response.data.sub, newUser_ID], (error, linkedinLogin) => {
                                            if (error) {
                                                return res.status(200).json({ error: true, message: `${error}`, data: null });
                                            }
                                            if (linkedinLogin.affectedRows === 1) {
                                                const id = linkedinLogin.insertId;
                                                var token = jwt.sign({ userId: id }, secretKey);
                                                return res.redirect(`http://localhost/landshare/Frontend/index.html?token=${token}&userId=${linkedinLogin.insertId}`)
                                            } else {
                                                return res.status(200).json({ error: true, message: "Not successfully linkedin login", data: null });
                                            }
                                        });
                                    };
                                })
                            }
                            else {
                                const id = rows[0].id;
                                var token = jwt.sign({ userId: id }, secretKey);
                                return res.redirect(`http://localhost/landshare/Frontend/index.html?token=${token}&userId=${rows[0].id}`)
                            }
                        });
                })
                .catch(error => {
                    return res.status(200).json({ error: true, message: `${error}`, data: null });
                });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = linkedinRouter;
