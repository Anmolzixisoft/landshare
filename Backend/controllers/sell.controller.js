const connection = require('../database/mysqldb')

function sellProperty(req, res) {

    const { user_id, property_category_select, landPrice, mobile_number, full_address, state, city, pincode, landmark, owenership, cost_per_squre_fit, size_of_land, desciption, ownerName, Survey_no, Land_Facing } = req.body
    const { image } = req.files
    // const file = image[0].filename
    if (!image) {
        return res.send({ error: "inter image" })
    }
    const imageArray = []
    image.forEach((element) => {
        imageArray.push(element.filename)
    })

    const sql = `INSERT INTO landsharein_db.tbl_sell_property (user_id, property_category_select, mobile_number, full_address, state, city, pincode, landmark, owenership, cost_per_squre_fit,landPrice, size_of_land, desciption,ownerName,Survey_no,Land_Facing,images) VALUES (?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,? ,?)`;
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
        landPrice,
        size_of_land,
        desciption,
        ownerName,
        Survey_no,
        Land_Facing,
        JSON.stringify(imageArray),
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
    const { user_id } = req.body
    connection.query(`SELECT sell_property.*, sortlist.status
    FROM landsharein_db.tbl_sell_property AS sell_property
    LEFT JOIN (
        SELECT property_id, status
        FROM landsharein_db.tbl_sortlist
        WHERE user_id = ?
    ) AS sortlist ON sell_property.id = sortlist.property_id
    ORDER BY sell_property.id DESC;
    `, [user_id], (err, result) => {
        if (err) {
            return res.send({ error: err })
        }
        else {
            result.forEach(element => {

                if (typeof element.images == 'string') {
                    element.images = element.images.split(',').map(image => {
                        return `http://192.168.29.179:5500/Backend/public/${image.trim().replace(/["[\]]/g, '')}`;
                    });
                } else if (Array.isArray(element.images)) {
                    element.images = element.images.map(image => `http://192.168.29.179:5500/Backend/public/${image}`);
                }

                if (element.status == null) {
                    element.status = 0
                }

            });

            return res.send({ data: result })
        }
    })
}

function getPropertyById(req, res) {
    const { id } = req.body
    connection.query('SELECT * FROM landsharein_db.tbl_sell_property WHERE id="' + id + '"', (err, result) => {
        if (err) {
            return res.send({ err: err })
        }
        else {
            result.forEach(element => {

                if (typeof element.images == 'string') {
                    element.images = element.images.split(',').map(image => {
                        return `http://192.168.29.179:5500/Backend/public/${image.trim().replace(/["[\]]/g, '')}`;
                    });
                } else if (Array.isArray(element.images)) {
                    element.images = element.images.map(image => `http://192.168.29.179:5500/Backend/public/${image}`);
                }

                if (element.status == null) {
                    element.status = 0
                }
            });
            return res.send({ message: result })
        }
    })
}

function updateProperty(req, res) {
    const { id, user_id, property_category_select, landPrice, mobile_number, full_address, state, city, pincode, landmark, cost_per_squre_fit, size_of_land, desciption, ownerName, Survey_no, Land_Facing } = req.body;
    const { image } = req.files

    const imageArray = []
    image.forEach((element) => {
        imageArray.push(element.filename)
    })

    const imagedata = JSON.stringify(imageArray)

    const sql = `UPDATE landsharein_db.tbl_sell_property SET  property_category_select= '${property_category_select}', mobile_number= ${mobile_number}, full_address='${full_address}', state= '${state}', city='${city}', pincode=${pincode}, landmark='${landmark}',cost_per_squre_fit='${cost_per_squre_fit}', landPrice='${landPrice}', size_of_land='${size_of_land}', desciption='${desciption}', ownerName='${ownerName}', Survey_no='${Survey_no}', Land_Facing='${Land_Facing}', images='${JSON.stringify(imageArray)}' WHERE id= ${id} AND  user_id='${user_id}'`


    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Database update error: ' + err.message);
            res.status(500).json({ error: 'Error updating data in the database' });
        } else {
            console.log('Data updated in the database.');
            res.status(200).json({ message: 'Property Updated' });
        }
    });
}

function deleteProperty(req, res) {
    const { propertyId, user_id } = req.body;
    const checkQuery = 'SELECT id FROM landsharein_db.tbl_sell_property WHERE id = "' + propertyId + '" AND user_id="' + user_id + '"';
    connection.query(checkQuery, (checkErr, checkResult) => {
        if (checkErr) {
            return res.send({ error: checkErr });
        }

        if (checkResult.length == 0) {
            return res.send({ error: 'Property not found' });
        }

        const deleteQuery = 'DELETE FROM landsharein_db.tbl_sell_property WHERE id = "' + propertyId + '" AND user_id="' + user_id + '"';
        connection.query(deleteQuery, (err, result) => {
            if (err) {
                return res.send({ error: err });
            }

            return res.send({ message: 'Property deleted successfully' });
        });
    });
}

function sortlist(req, res) {
    const { property_id, user_id, status } = req.body
    connection.query('select * from landsharein_db.tbl_sortlist where property_id=? and user_id=?', [property_id, user_id], (err, result) => {
        console.log(err, 'err');
        if (result.length > 0) {

            // return res.status(200).json({ message: 'Property alredy sorlisted' });
            connection.query('UPDATE landsharein_db.tbl_sortlist SET status = "' + status + '" WHERE user_id = "' + user_id + '" AND property_id = "' + property_id + '"', (err, updateResult) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to update status' });
                }
                return res.status(200).json({ message: 'Property status updated' });
            })
        } else {
            const sql = `INSERT INTO landsharein_db.tbl_sortlist (user_id, property_id, status) VALUES (?, ?, ?)`;
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
    SELECT landsharein_db.tbl_sell_property.*, landsharein_db.tbl_sortlist.*
    FROM landsharein_db.tbl_sortlist
    LEFT JOIN landsharein_db.tbl_sell_property ON landsharein_db.tbl_sell_property.id = landsharein_db.tbl_sortlist.property_id
    WHERE landsharein_db.tbl_sortlist.user_id = ?`;

    connection.query(query, [user_id], (err, result) => {
        if (err) {
            console.error("MySQL error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        } else {
            result.forEach(element => {
                if (typeof element.images == 'string') {
                    element.images = element.images.split(',').map(image => {
                        return `http://192.168.29.179:5500/Backend/public/${image.trim().replace(/["[\]]/g, '')}`;
                    });
                } else if (Array.isArray(element.images)) {
                    element.images = element.images.map(image => `http://192.168.29.179:5500/Backend/public/${image}`);
                }

            });
            return res.send({ data: result })
        }
    }
    )
}

function buyInfo(req, res) {
    const { user_id, property_id } = req.body
    const sql = 'INSERT INTO landsharein_db.tbl_buy (user_id, property_id) VALUES (?,?)';
    const values = [user_id, property_id];
    connection.query(sql, values, (err, result) => {
        if (err) {
            console.log(err, 'err');
            return res.send({ err: err })
        }
        else {
            return res.send({ message: " added" })
        }
    })
}

function getsortlistByID(req, res) {
    const { property_id, user_id } = req.body
    connection.query('select * from landsharein_db.tbl_sortlist where property_id="' + property_id + '" and user_id="' + user_id + '"', (err, result) => {
        return res.send({ data: result })
    })

}

function sold_property(req, res) {
    const { propertyId, user_id, sold_status } = req.body
    connection.query('UPDATE landsharein_db.tbl_sell_property SET sold = "' + sold_status + '" WHERE user_id = "' + user_id + '" AND id = "' + propertyId + '"', (err, updateResult) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update status' });
        }
        return res.status(200).json({ message: 'sold status updated' });
    })
}

function enquire(req, res) {
    const { user_id } = req.body
    connection.query(`SELECT
landsharein_db.tbl_sell_property.*,
        landsharein_db.tbl_buy.user_id,landsharein_db.tbl_buy.enquire_create_at,
        landsharein_db.tbl_user.*
        FROM landsharein_db.tbl_sell_property
LEFT JOIN landsharein_db.tbl_buy ON landsharein_db.tbl_buy.property_id = landsharein_db.tbl_sell_property.id
LEFT JOIN landsharein_db.tbl_user ON landsharein_db.tbl_user.id = landsharein_db.tbl_buy.user_id
WHERE
landsharein_db.tbl_sell_property.user_id = ${user_id} AND landsharein_db.tbl_buy.property_id = landsharein_db.tbl_sell_property.id`, (err, result) => {
        if (err) {
            return res.send({ error: err })
        } else {
            return res.send({ message: result })
        }
    })

}



module.exports = { sellProperty, getProperty, getPropertyById, sortlist, getsortlist, buyInfo, getsortlistByID, updateProperty, deleteProperty, sold_property, enquire }

