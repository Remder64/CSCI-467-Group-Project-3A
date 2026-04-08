var express = require('express');
var app = express();
const port = 4010;

app.set('view engine', 'ejs');
app.set('views', './views');



app.get('/', function(req, res) {
  res.render('main');
});

const parts = require('./controllers/parts');
app.get('/getParts', (req, res) => {
  parts.getAll((list) => {
    res.render('parts.ejs', { all: list });
  });
});  

const credit = require('./controllers/credit');
app.get('/processCC', (req, res) => {
  credit.processSample((result) => {
    res.render('credit.ejs', { data: result });
  });
})


app.all('/secret', (req, res, next) => {
    res.send('Kill yourself');
    console.log('Time: ', Date.now());
    next();
});


app.listen(port, () => {
  console.log(`Listening to this bs at ${port}`)
});



//view engine
//app.set('view engine', 'ejs');

