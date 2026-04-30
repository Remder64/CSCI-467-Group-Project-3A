var mysql = require('mysql2')
var pool2 = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'idk123hbm@^&[]',
    database: 'auto_parts',
    port: '3306'
});


module.exports = {
    partID: async result => {
        pool2.query('SELECT * FROM inventory', function(err, rows){
            if (err) throw err;
            console.log('found ', rows.length , ' parts');
            result(rows);
        });
    },
}