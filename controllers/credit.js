const axios = require('axios');
const express = require('express');
var app = express();

//global variables
let currentRandChars = randCharGenerator();
let counter = 1;

function transIdGenerator() {
    if( counter > 9999 ) {
        currentRandChars = randCharGenerator();
        counter = 1;
    }

    var padding = String(counter).padStart(4, '0');

    const transID = "MAP-" + currentRandChars + "-" + padding;

    return transID;
}

function randCharGenerator() {
    var chars = 'abcdefghjkmnpqrtuvwxyzABCDEFGHJKMNPQRTUVWXYZ0123456789'
    var randID = '';

    for( let i = 0; i < 8; i++ ) {
        const randChars = Math.floor(Math.random() * chars.length);
        randID += chars.charAt(randChars);
    }

    return randID;
}


module.exports = {
    processTrans: async (item, result) => {

        const transID = transIdGenerator();

        var data = {
            'vendor': 'MANual Auto & Parts',
            'trans': transID,
            'cc': item.cc,
            'name': item.name, 
            'exp': item.exp, 
            'amount': item.amount.toFixed(2)
        };
        axios.post('http://blitz.cs.niu.edu/creditcard', data).then((response) => {           
            result(response.data);
        }).catch(err => {
            throw err;
        });
    }
}
