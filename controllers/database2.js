var mysql = require('mysql2')
var pool2 = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'idk123hbm@^&[]',
    database: 'auto_parts',
    port: '3306'
});

//'UPDATE inventory SET qunatityOnHand = 'param1' WHERE partNumber = 'param2' '

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
}
