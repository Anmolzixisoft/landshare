const connection = require('../database/mysqldb')

function sellProperty(req, res) {

    const { user_id, property_category_select, mobile_number, full_address, state, city, pincode, landmark, owenership, cost_per_squre_fit, size_of_land, desciption, ownerName, Survey_no, Land_Facing } = req.body
    const { image } = req.files
    const file = image[0].filename

    const sql = `INSERT INTO test.sell_property (user_id, property_category_select, mobile_number, full_address, state, city, pincode, landmark, owenership, cost_per_squre_fit, size_of_land, desciption,ownerName,Survey_no,Land_Facing,images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?)`;
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
    connection.query(`SELECT * FROM test.sell_property`, (err, result) => {
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
    connection.query('SELECT * FROM test.sell_property WHERE id="' + id + '"', (err, result) => {
        if (err) {
            return res.send({ err: err })
        }
        else {
            return res.send({ message: result })
        }
    })
}

function sortlist(req, res) {
    const { sort, id } = req.body

    // if(!sort || !id){
    //     return res.send({err:"please fill field"})
    // }
    connection.query('UPDATE test.sell_property SET shortList = "' + sort + '" WHERE id="' + id + '"', (err, result) => {
        if (err) {
            return res.send({ err: err })
        }
        else {
            return res.send({ message: "success", result })
        }
    })
}
function getsortlist(req, res) {
    connection.query('SELECT * FROM test.sell_property WHERE shortList=1', (err, result) => {
        if (err) {
            return res.send({ err: err })
        } else {
            return res.send({ data: result })
        }
    }
    )
}
module.exports = { sellProperty, getProperty, updateProperty, getPropertyById, sortlist, getsortlist }