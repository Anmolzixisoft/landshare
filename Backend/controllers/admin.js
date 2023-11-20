const connection = require('../database/mysqldb');
const jwt = require('jsonwebtoken');

const adminLogin = (req, res) => {
    try {
        const user = req.body;
        if (user.email === '') {
            const error = "Please enter the email";
            return res.status(200).json({ error: true, message: `${error}`, data: null })
        }
        if (user.password === '') {
            const error = "Please enter the password";
            return res.status(200).json({ error: true, message: `${error}`, data: null })
        }
        connection.query('SELECT * FROM landsharein_db.tbl_admin WHERE email = "' + user.email + '"', (error, findEmail) => {
            if (error) {
                return res.status(200).json({ error: true, message: `${error}`, data: null })
            }
            if (findEmail[0] == undefined) {
                const error = "Incorrect Email";
                return res.status(200).json({ error: true, message: `${error}`, data: null })
            } else {
                if (findEmail[0].password === user.password) {
                    const token = jwt.sign({ userId: findEmail[0].id }, 'thisismyadminsceretkey');
                    findEmail[0].token = token;
                    return res.status(200).json({ error: false, message: "Successfully Login", data: findEmail })
                } else {
                    const error = "Incorrect password";
                    return res.status(200).json({ error: true, message: `${error}`, data: null })
                }
            }
        })
    } catch (err) {
        return res.status(500).json({ error: true, message: `${err}`, data: null })
    }
}


function getadmin(req, res) {
    try {
        connection.query('SELECT * FROM landsharein_db.tbl_admin', (err, result) => {
            if (err) {
                return res.status(500).json({ error: true, message: `${err}`, data: null })

            }
            else {
                result = result[0]
                result.profile_image= `http://192.168.29.179:5500/Backend/public/${result.profile_image}`
                return res.send({ message: result })
            }
        })
    } catch (error) {
        return res.status(500).json({ error: true, message: `${error}`, data: null })
    }
}

function updateprofile(req, res) {
    try {
        const { name, email, password, id } = req.body
        const { profile_image } = req.files

        var image = '';
        if (typeof profile_image !== 'undefined') {
            image = '`Image` = "' + profile_image[0].filename + '" ';
        }

        if (profile_image) {

            image = profile_image[0].filename
            const sql = 'UPDATE  landsharein_db.tbl_admin SET `name`="' + name + '",`email`="' + email + '",`password`="' + password + '",profile_image="' + image + '"  WHERE id="' + id + '"'
            
            connection.query(sql, (err, result) => {
                if (err) {
                    console.log(err, 'err');
                    return res.status(500).json({ error: true, message: `${err}`, data: null })
                }
                else {
                    return res.send({ message: "update ", success: true })
                }
            })
        }
        else {

            const sql = 'UPDATE  landsharein_db.tbl_admin SET `name`=?, email=?, password=?' + image + ' WHERE id= ?'

            connection.query(
                sql, [name, email, password, id],
                (err, result1) => {
                    if (err) {
                        console.error('Update error:', err);
                        return res.status(500).json({ error: 'Update error' });
                    }

                    return res.status(200).json({ success: true, message: 'Profile updated success' });
                }
            );
        }
    } catch (error) {
        return res.status(500).json({ error: true, message: `${error}`, data: null })

    }
}

module.exports = { adminLogin, getadmin, updateprofile };