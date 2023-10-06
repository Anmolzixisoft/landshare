const connection = require('../database/mysqldb')

function Ourservice(req, res) {
    const { name, email, select, comment, address } = req.body
    if (!name || !email || !address) {
        return res.send({ err: "please fill field " })
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
            res.status(200).json({ message: 'service data  Added',success:true });
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
module.exports = { Ourservice, getService }