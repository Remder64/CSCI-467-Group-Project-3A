/*
Run this code **ONCE** to copy the data from the cloud database to the local database 
make sure your local database server is running
use npm install --save mysql2 and node copy.js
*/
const mysql = require('mysql2/promise');

//cloud database
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
//local database (may need to change)
const pool2 = mysql.createPool({
    host: 'localhost',
    user: 'guest', //change to your user
    password: 'guest123', //change to your password
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
