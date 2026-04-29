
const mysql = require('mysql2/promise');

//cloud
const pool1 = mysql.createPool({
    host: 'blitz.cs.niu.edu',
    user: 'student',
    password: 'student',
    database: 'csci467',
    port: '3306',
    ssl: {
        rejectUnauthorized: false
    }
});
//local
const pool2 = mysql.createPool({
    host: 'localhost',
    user: 'guest',
    password: 'guest123',
    database: 'auto_parts',
    port: '3306'
});

async function copyParts() {
    try {
        const [rows] = await pool1.query('SELECT number, description FROM parts');

        console.log(`Fetched ${rows.length} parts`);

        for (const autoParts of rows) {
            await pool2.query('INSERT INTO inventory (partNumber, quantityOnHand, description) VALUES (?,2,?)',
                [autoParts.number, autoParts.description]);
        }

        console.log('Data copied successfully!');
    }

    catch(err) {
        console.error(err);

    }
}

copyParts();
