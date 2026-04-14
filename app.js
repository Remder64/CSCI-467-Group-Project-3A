var express = require('express');
var app = express();
//var bodyParser = require('body-parser');
//var multer = require('multer');
//var upload = multer();
const data = require('./controllers/credit');
const port = 4010;

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', function(req, res) {
  res.render('main');
});


//part webpage
const parts = require('./controllers/parts');
app.get('/getParts', (req, res) => {
  parts.getAll((list) => {
    res.render('parts.ejs', { all: list });

  });
});  

app.get('/getParts/item', (req, res) => {
  res.send('This will be a item, you can buy it eventually');
})

//credit webpage
const credit = require('./controllers/credit');
app.get('/processCC', (req, res) => {
  credit.processSample((result) => {
    res.render('credit.ejs', { data: result });
  });
})

app.get('/', (req, res) => {
  console.log("A new request received at " + Date().now());
})


app.listen(port, () => {
  console.log(`Listening to this bs at ${port}`)
});



//view engine
//app.set('view engine', 'ejs');

