const connection = require('../database/mysqldb')
// Middleware function to check if a user is already registered

function checkIfUserExists(req, res, next) {
    const { email, mobile_number } = req.body; // Assuming email is sent in the request body

    connection.query(
        'SELECT * FROM test.tbl_user WHERE email = ?  or mobile_number=?',
        [email, mobile_number],
        (err, results) => {
            if (err) {
                console.error('Error checking email existence: ' + err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (results.length > 0) {
                // User with this email already exists
                return res.status(409).json({ error: 'User already registered with this email or mobile_number' });
            } else {
                // User is not registered, proceed to the next middleware or route handler
                next();
            }
        }
    );
}

module.exports = { checkIfUserExists };
