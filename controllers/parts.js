var mysql = require('mysql')

//local database
//alter to match your local connection
var pool = mysql.createPool({
  host: 'blitz.cs.niu.edu',
  user: 'student',
  password: 'student',
  database: 'csci467',
  port: '3306',
  ssl: true
});

module.exports = {
    getAll: async result => {
        pool.query('SELECT * FROM parts', function(err, rows){
            if (err) throw err;
            console.log('found ', rows.length , ' parts');
            result(rows);
        });
    },

    getByNum: async (partNum, result) => {
        pool.query('SELECT * FROM parts WHERE number = ?', [partNum], function(err, rows) {
            if(err) throw err;
            result(rows[0]);
        })
    },

    searchAll: async (searchStr, result) => {
        pool.query('SELECT * FROM parts WHERE description LIKE ?', ['%' + searchStr + '%'], function(err, rows) {
            if(err) throw err;
            console.log('found ', rows.length , ' parts');
            result(rows);
        })
    }
}
