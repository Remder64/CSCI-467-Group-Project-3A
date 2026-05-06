var mysql = require('mysql2');

//local database
//alter to match your local connection
var pool2 = mysql.createPool({
    host: 'localhost',
    user: 'guest',
    password: 'guest123',
    database: 'auto_parts',
    port: '3306'
});

module.exports = {

    createOrder: (orderData, result) => {
        const { custName, custEmail, custAddress, custCity, custState, custZip,
                subtotal, shippingCharge, price, weightLB, authNumber, transactionID } = orderData;

        const safeSubtotal    = parseFloat(subtotal)    || 0;
        const safeShipping    = parseFloat(shippingCharge) || 0;
        const safePrice       = parseFloat(price)       || 0;
        const safeWeight      = parseFloat(weightLB)    || 0;

        pool2.query(
            `INSERT INTO customerorders
             (date, time, status, subtotal, shippingCharge, price, weightLB,
              authNumber, transactionID, custName, custEmail, custAddress, custCity, custState, custZip)
             VALUES (CURDATE(), CURTIME(), 'authorized', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [safeSubtotal, safeShipping, safePrice, safeWeight,
             authNumber, transactionID,
             custName, custEmail, custAddress, custCity, custState, custZip],
            function(err, rows) {
                if (err) throw err;
                result(rows.insertId);
            }
        );
    },

    addOrderItem: (orderID, partNumber, quantity, unitPrice, weightEach, result) => {
        pool2.query(
            'INSERT INTO orderitems (orderID, partNumber, quantity, unitPrice, weightEach) VALUES (?, ?, ?, ?, ?)',
            [orderID, partNumber, parseFloat(quantity) || 1, parseFloat(unitPrice) || 0, parseFloat(weightEach) || 0],
            function(err, rows) {
                if (err) throw err;
                result(rows);
            }
        );
    }

};
