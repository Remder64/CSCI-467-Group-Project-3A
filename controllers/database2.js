var mysql = require('mysql2')

//controller for local database
//alter to match your local connection
var pool2 = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'idk123hbm@^&[]',
    database: 'auto_parts',
    port: '3306'
});

module.exports = {
    //get all info on parts in inventory
    partID: async result => {
        pool2.query('SELECT * FROM inventory', function(err, rows){
            if (err) throw err;
            console.log('found ', rows.length , ' parts');
            result(rows);
        });
    },

    //changes the quantity on hand for a specific part
    ChangeQuantity: (partNumber, quantity, result) => {
        pool2.query(
            'UPDATE inventory SET quantityOnHand = ? WHERE partNumber = ?',
            [quantity, partNumber],
            function (err, rows) {
                if (err) throw err;
                console.log('changed ', rows.affectedRows, ' row in inventory');
                //result(rows); not needed?
            }
        );
    },

    //get all info on customer orders
    custOrderID: async result => {
        pool2.query('SELECT * FROM customerorders', function (err, rows) {
            if (err) throw err;
            console.log('found ', rows.length, ' customer orders');
            result(rows);
        });
    },

    //get only orders that are authorized
    AuthOrders: async result => {
        pool2.query('SELECT * FROM customerorders WHERE status = \'authorized\'', function (err, rows) {
            if (err) throw err;
            console.log('found ', rows.length, ' customer orders with the status: authorized');
            result(rows);
        });
    },
    
    //get all parts on a specific order
    orderPartID: async (orderID, result) => {
        pool2.query('SELECT * FROM orderParts WHERE orderID = ?' [orderID], function (err, rows) {
            if (err) throw err;
            console.log('found ', rows.length, ' parts');
            result(rows);
        });
    },

    // ── WAREHOUSE ──────────────────────────────────────

    getAuthorizedOrders: (result) => {
        pool2.query(
            "SELECT * FROM customerorders WHERE status = 'authorized' ORDER BY date, time",
            function(err, rows) {
                if (err) throw err;
                result(rows);
            }
        );
    },

    getOrderByID: (orderID, result) => {
        pool2.query('SELECT * FROM customerorders WHERE orderID = ?', [orderID],
            function(err, rows) {
                if (err) throw err;
                result(rows[0]);
            }
        );
    },

    getOrderItems: (orderID, result) => {
        pool2.query('SELECT * FROM orderitems WHERE orderID = ?', [orderID],
            function(err, rows) {
                if (err) throw err;
                result(rows);
            }
        );
    },

    shipOrder: (orderID, result) => {
        pool2.query(
            "UPDATE customerorders SET status = 'shipped' WHERE orderID = ?", [orderID],
            function(err, rows) {
                if (err) throw err;
                result(rows);
            }
        );
    },

    // ── ADMIN ──────────────────────────────────────────

    getShippingRates: (result) => {
        pool2.query('SELECT * FROM shippingrates ORDER BY minWeight', function(err, rows) {
            if (err) throw err;
            result(rows);
        });
    },

    changemin: (result) => {
        pool2.query('UPDATE shippingrates SET minWeight = ? WHERE rateID = ?', function(err, rows) {
            [minWeight, rateID],
            function (err, rows) {
                if (err) throw err;
                console.log('changed ', rows.affectedRows, ' row in inventory');
                //result(rows); not needed?
            }
        });
    },

    changemax: (result) => {
        pool2.query('UPDATE shippingrates SET maxWeight = ? WHERE rateID = ?', function(err, rows) {
            [maxWeight, rateID],
            function (err, rows) {
                if (err) throw err;
                console.log('changed ', rows.affectedRows, ' row in inventory');
                //result(rows); not needed?
            }
        });
    },

    /*
    //changes the quantity on hand for a specific part
    ChangeQuantity: (partNumber, quantity, result) => {
        pool2.query(
            'UPDATE inventory SET quantityOnHand = ? WHERE partNumber = ?',
            [quantity, partNumber],
            function (err, rows) {
                if (err) throw err;
                console.log('changed ', rows.affectedRows, ' row in inventory');
                //result(rows); not needed?
            }
        );
    },
    */
    
    addShippingRate: (minWeight, maxWeight, charge, result) => {
        pool2.query(
            'INSERT INTO shippingrates (minWeight, maxWeight, charge) VALUES (?, ?, ?)',
            [minWeight, maxWeight, charge],
            function(err, rows) { if (err) throw err; result(rows); }
        );
    },
    
    deleteShippingRate: (rateID, result) => {
        pool2.query('DELETE FROM shippingrates WHERE rateID = ?', [rateID],
            function(err, rows) { if (err) throw err; result(rows); }
        );
    },
    
    searchOrders: (filters, result) => {
        let query = 'SELECT * FROM customerorders WHERE 1=1';
        const params = [];
        if (filters.dateFrom) { query += ' AND date >= ?';  params.push(filters.dateFrom); }
        if (filters.dateTo)   { query += ' AND date <= ?';  params.push(filters.dateTo); }
        if (filters.status)   { query += ' AND status = ?';      params.push(filters.status); }
        if (filters.priceMin) { query += ' AND price >= ?'; params.push(filters.priceMin); }
        if (filters.priceMax) { query += ' AND price <= ?'; params.push(filters.priceMax); }
        query += ' ORDER BY date DESC';
        pool2.query(query, params, function(err, rows) { if (err) throw err; result(rows); });
    }
}
