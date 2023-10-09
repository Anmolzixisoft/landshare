const connection = require('../database/mysqldb')

function sellProperty(req, res) {

    const { user_id, property_category_select, mobile_number, full_address, state, city, pincode, landmark, owenership, cost_per_squre_fit, size_of_land, desciption, ownerName, Survey_no, Land_Facing } = req.body
    const { image } = req.files
    const file = image[0].filename

    const sql = `INSERT INTO test.tbl_sell_property (user_id, property_category_select, mobile_number, full_address, state, city, pincode, landmark, owenership, cost_per_squre_fit, size_of_land, desciption,ownerName,Survey_no,Land_Facing,images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,? ,?)`;
    const values = [
        user_id,
        property_category_select,
        mobile_number,
        full_address,
        state,
        city,
        pincode,
        landmark,
        owenership,
        cost_per_squre_fit,
        size_of_land,
        desciption,
        ownerName,
        Survey_no,
        Land_Facing,
        file,
    ];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Database insertion error: ' + err.message);
            res.status(500).json({ error: 'Error inserting data into the database' });
        } else {
            console.log('Data inserted into the database.');
            res.status(200).json({ message: 'Property Added' });
        }
    });

}
function getProperty(req, res) {
    connection.query(`SELECT * FROM test.tbl_sell_property`, (err, result) => {
        if (err) {
            return res.send({ error: err })
        }
        else {
            return res.send({ data: result })
        }
    })
}
function updateProperty(req, res) {
    const { property_category_select, mobile_number, full_address, state, city, pincode, landmark, owenership, cost_per_squre_fit, size_of_land } = req.body
    connection.query(
        `UPDATE test.tbl_user SET name=?, mobile_number=?, password=? WHERE otp=?`,
        [name, mobile_number, hashedPassword, otp],
        (err, result1) => {
            if (err) {
                console.error('Update error:', err);
                return res.status(500).json({ error: 'Update error' });
            }

            return res.status(200).json({ success: true, message: 'User SignUp successfully' });
        }
    );
}

function getPropertyById(req, res) {
    const { id } = req.body
    connection.query('SELECT * FROM test.tbl_sell_property WHERE id="' + id + '"', (err, result) => {
        if (err) {
            return res.send({ err: err })
        }
        else {
            return res.send({ message: result })
        }
    })
}

function sortlist(req, res) {
    const { property_id, user_id, status } = req.body
    connection.query('select * from test.tbl_sortlist where property_id=? and user_id=?', [property_id, user_id], (err, result) => {
        if (result.length > 0) {
            return res.status(200).json({ message: 'Property alredy sorlisted' });
        } else {
            const sql = `INSERT INTO test.tbl_sortlist (user_id, property_id, status) VALUES (?, ?, ?)`;
            const values = [
                user_id,
                property_id,
                status,
            ];

            connection.query(sql, values, (err, result) => {
                if (err) {
                    console.error('Database insertion error: ' + err.message);
                    res.status(500).json({ error: 'Error inserting data into the database' });
                } else {
                    console.log('Data inserted into the database.');
                    res.status(200).json({ message: 'Property sorlisted' });
                }
            });
        }

    })

}
function getsortlist(req, res) {
    const user_id = req.body.user_id;
    const query = `
    SELECT test.tbl_sell_property.*, test.tbl_sortlist.status
    FROM test.tbl_sortlist
    LEFT JOIN test.tbl_sell_property ON test.tbl_sell_property.id = test.tbl_sortlist.property_id
    WHERE test.tbl_sortlist.user_id = ?`;

    connection.query(query, [user_id], (err, result) => {
        if (err) {
            console.error("MySQL error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        } else {
            return res.send({ data: result })
        }
    }
    )
}

function buyInfo(req, res) {
    const { user_id } = req.body
    const sql = 'INSERT INTO test.tbl_buy (user_id) VALUES (?)';
    const values = [user_id];
    connection.query(sql, values, (err, result) => {
        if (err) {
            return res.send({ err: err })
        }
        else {
            return res.send({ message: "user added" })
        }
    })
}
module.exports = { sellProperty, getProperty, updateProperty, getPropertyById, sortlist, getsortlist, buyInfo }