const connection = require('../database/mysqldb')

function sellProperty(req, res) {

    const { user_id, property_category_select, landPrice, mobile_number, full_address, state, city, pincode, landmark, owenership, cost_per_squre_fit, size_of_land, total_landsqft, desciption, ownerName, Survey_no, Land_Facing } = req.body
    console.log(req.body);
    const { image, latest_encumbrance,
        khata_extract, } = req.files
    // const file = image[0].filename
    if (!image) {
        return res.send({ error: "inter image" })
    }
    const imageArray = []
    image.forEach((element) => {
        imageArray.push(element.filename)
    })
    if (latest_encumbrance != undefined) {
        var Latest_Encumbrance = latest_encumbrance[0].filename;
    }
    if (khata_extract != undefined) {
        var Khata_Extract = khata_extract[0].filename;
    }
    const sql = `INSERT INTO landsharein_db.tbl_sell_property (user_id, property_category_select, mobile_number, full_address, state, city, pincode, landmark, owenership, cost_per_squre_fit,landPrice, size_of_land, total_landsqft, desciption,ownerName,Survey_no,Land_Facing,images,Latest_Encumbrance,Khata_Extract) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
        total_landsqft,
        desciption,
        ownerName,
        Survey_no,
        Land_Facing,
        JSON.stringify(imageArray),
        Latest_Encumbrance,
        Khata_Extract,
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
                if (typeof element.Latest_Encumbrance == 'string') {
                    element.Latest_Encumbrance = `http://192.168.29.179:5500/Backend/public/${element.Latest_Encumbrance}`
                }
                if (typeof element.Khata_Extract == 'string') {
                    element.Khata_Extract = `http://192.168.29.179:5500/Backend/public/${element.Khata_Extract}`
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
    const { id, user_id, property_category_select, landPrice, mobile_number, full_address, state, city, pincode, landmark, cost_per_squre_fit, size_of_land, total_landsqft, desciption, ownerName, Survey_no, Land_Facing } = req.body;
    const { latest_encumbrance, khata_extract, image } = req.files
    var latest_encumbranceimage1 = '';
    if (typeof latest_encumbrance !== 'undefined') {
        latest_encumbranceimage1 = '`Image` = "' + latest_encumbrance[0].filename + '" ';
    }
    var khata_extractimage1 = '';
    if (typeof khata_extract !== 'undefined') {
        khata_extractimage1 = '`Image` = "' + khata_extract[0].filename + '" ';
    }

    const imageArray = []
    if (image !== undefined) {
        image.forEach((element) => {
            imageArray.push(element.filename)
        })
    }


    const imagedata = JSON.stringify(imageArray)

    const sql = `UPDATE landsharein_db.tbl_sell_property SET  property_category_select= '${property_category_select}', mobile_number= ${mobile_number}, full_address='${full_address}', state= '${state}', city='${city}', pincode=${pincode}, landmark='${landmark}',cost_per_squre_fit='${cost_per_squre_fit}', landPrice='${landPrice}', size_of_land='${size_of_land}',total_landsqft = '${total_landsqft}' , desciption='${desciption}', ownerName='${ownerName}', Survey_no='${Survey_no}', Land_Facing='${Land_Facing}', images='${JSON.stringify(imageArray)}' ${latest_encumbranceimage1} ${khata_extractimage1} WHERE id= ${id} AND  user_id='${user_id}'`

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
    connection.query('SELECT * FROM landsharein_db.tbl_buy WHERE user_id = "' + user_id + '" AND property_id = "' + property_id + '"', (error, findBuyer) => {
        if (error) {
            return res.send({ err: error })
        }
        if (findBuyer[0] == undefined) {
            const sql = 'INSERT INTO landsharein_db.tbl_buy (user_id, property_id) VALUES (?,?)';
            const values = [user_id, property_id];


            const notification = `UPDATE landsharein_db.tbl_notificatin
            SET notification_count = notification_count + 1
            WHERE id = 2`
            connection.query(notification, (err, notificationdata) => {
                console.log(notification);
                if (err) {
                    console.error('Update error:', err);
                    return res.status(500).json({ error: 'Update error' });
                }
            })
            connection.query(sql, values, (err, result) => {
                if (err) {
                    return res.send({ err: err })
                }
                else {
                    return res.send({ message: " added" })
                }
            })
        } else {
            return res.send({ err: "your are already enquire this property" })
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

const enquireproperty = (req, res) => {
    try {
        connection.query('SELECT landsharein_db.tbl_sell_property.id AS sell_property_id, landsharein_db.tbl_sell_property.*, landsharein_db.tbl_user.*, owner_user.name AS owner_name, owner_user.mobile_number AS owner_number FROM landsharein_db.tbl_buy LEFT JOIN landsharein_db.tbl_sell_property ON landsharein_db.tbl_buy.property_id = landsharein_db.tbl_sell_property.id LEFT JOIN landsharein_db.tbl_user ON landsharein_db.tbl_buy.user_id = landsharein_db.tbl_user.id LEFT JOIN landsharein_db.tbl_user AS owner_user ON landsharein_db.tbl_sell_property.user_id = owner_user.id', (error, findEnquiry) => {
            if (error) {
                return res.send({ error: error });
            }
            if (findEnquiry[0] == undefined) {
                return res.send({ error: "not any enquires" });
            } else {
                return res.send({ message: findEnquiry })
            }
        })
    } catch (error) {
        return res.send({ error: error });
    }
}

function getallproperty(req, res) {
    connection.query('select * from landsharein_db.tbl_sell_property ', (err, result) => {
        if (err) {
            return res.send({ error: err }
            )
        }
        else {
            return res.send({ message: result })
        }
    })
}

function updatestatus(req, res) {
    const { propertyId, status } = req.body
    connection.query('select * from landsharein_db.tbl_sell_property where id="' + propertyId + '" ', (err, result) => {
        if (err) {
            return res.send({ error: err }
            )
        }
        if (result.length == 0) {
            return res.send({ error: "not found " })
        }
        else {
            connection.query('UPDATE landsharein_db.tbl_sell_property SET property_status="' + status + '"  where id="' + propertyId + '"', (err, result) => {
                if (err) {
                    return res.send({ error: err })
                }
                else {
                    return res.send({ message: "succesfully" })
                }
            })

        }
    })
}


const notification = (req, res) => {
    try {
        connection.query('SELECT * FROM landsharein_db.tbl_notificatin WHERE 1', (err, notificationdata) => {
            if (err) {
                return res.send({ error: err })

            }
            else {
                return res.send({ message: notificationdata })
            }
        })
    } catch (error) {
        return res.send({ error: error })

    }
}



const updatenotification = (req, res) => {
    const notification = `UPDATE landsharein_db.tbl_notificatin
    SET notification_count = 0
    WHERE id = 2`
    connection.query(notification, (err, notificationdata) => {
        console.log(notification);
        if (err) {
            console.error('Update error:', err);
            return res.status(500).json({ error: 'Update error' });
        }
        else {
            return res.send({ message: "update" })
        }
    })
}

module.exports = { sellProperty, getProperty, getPropertyById, sortlist, getsortlist, buyInfo, getsortlistByID, updateProperty, deleteProperty, sold_property, enquire, getallproperty, updatestatus, enquireproperty, notification, updatenotification }

