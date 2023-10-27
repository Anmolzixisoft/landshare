const connection = require('../database/mysqldb');
const jwt = require('jsonwebtoken');

const adminLogin = (req, res) => {
    try{
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
                    const token = jwt.sign({ userId: findEmail[0].id}, 'thisismyadminsceretkey');
                    findEmail[0].token = token;
                    return res.status(200).json({ error: false, message: "Successfully Login", data: findEmail })
                } else {
                    const error = "Incorrect password";
                    return res.status(200).json({ error: true, message: `${error}`, data: null })
                }
            }
        })
    } catch(err){
        return res.status(500).json({error: true, message: `${err}`, data: null})
    }
}

module.exports = { adminLogin };