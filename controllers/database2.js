var mysql = require('mysql2')
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
                result(rows);
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

    //get all parts on a specific order
    orderPartID: async (orderID, result) => {
        pool2.query('SELECT * FROM orderParts WHERE orderID = ?', function (err, rows) {
            if (err) throw err;
            console.log('found ', rows.length, ' customer orders');
            result(rows);
        });
    },
}
