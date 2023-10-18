const connection = require('../database/mysqldb')

function checkIfUserExists(req, res, next) {
    const { email } = req.body;

    connection.query(
        'SELECT * FROM landsharein_db.tbl_user WHERE email = ? ',
        [email],
        (err, results) => {
            if (err) {
                console.error('Error checking email existence: ' + err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (results.length > 0) {
                return res.status(409).json({ error: 'User already registered with this email ' });
            } else {
                next();
            }
        }
    );
}

module.exports = { checkIfUserExists };
