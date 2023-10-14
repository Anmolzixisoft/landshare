const connection = require('../database/mysqldb')

function Ourservice(req, res) {
    const { name, email, select, comment, address } = req.body
    if (!name || !email || !address) {
        return res.send({ err: "please fill field " })
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format', status: false });
    }
    const sql = `INSERT INTO test.tbl_OurService ( name,email,select_work,comment ,address) VALUES (?, ?, ?, ?, ?)`;
    const values = [
        name, email, select, comment, address
    ];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Database insertion error: ' + err.message);
            res.status(500).json({ error: 'Error inserting data into the database' });
        } else {
            console.log('Data inserted into the database.');
            res.status(200).json({ message: 'service data  Added', success: true });
        }
    });


}
function getService(req, res) {
    connection.query('select * from  test.tbl_OurService ', (err, result) => {
        if (err) {
            return res.send({ error: err })
        } else {
            return res.send({ message: result })
        }
    })
}
function isValidMobileNumber(mobile_number) {

    const mobileRegex = /^[0-9]{10}$/;

    return mobileRegex.test(mobile_number);
}
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function Touch(req, res) {
    const { name, email, phone, subject, message } = req.body
    if (!name || !email) {
        return res.send({ err: "please fill field " })
    }
    if (!isValidMobileNumber(phone)) {
        return res.status(400).json({ error: 'Invalid mobile number format', status: false });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format', status: false });
    }
    const sql = `INSERT INTO test.tbl_touch (  name, email, phone_no, subject, message) VALUES (?, ?, ?, ?, ?)`;
    const values = [
        name, email, phone, subject, message
    ];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Database insertion error: ' + err.message);
            res.status(500).json({ error: 'Error inserting data into the database' });
        } else {
            console.log('Data inserted into the database.');
            res.status(200).json({ message: ' data  Added', success: true });
        }
    });

}
module.exports = { Ourservice, getService, Touch }