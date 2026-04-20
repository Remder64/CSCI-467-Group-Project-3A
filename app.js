const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exSession = require('express-session');
const path = require("path");
const port = 4010;

app.set('view engine', 'ejs');
app.set('views', './views');

//intializing user sessions
app.use(exSession({
  secret: "Mt64ka901nMnl0",
  resave: false,
  saveUninitialized: true
}));

//parses form data and puts it in req.body
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



app.get('/', function(req, res) {
  res.render('main');
});



//part webpage
const parts = require('./controllers/parts');
app.get('/getParts', (req, res) => {
  parts.getAll((list) => {
    const partsInCart = req.session.cart ? req.session.cart.length : 0;
    res.render('parts.ejs', {all: list, partsInCart});

  });
});  

//catalog search bar
app.post('/getParts/search', async (req, res) => {
  const searchStr = req.body.search;

  parts.searchAll(searchStr, (strs) => {
    if(strs.length === 0) return res.status(404).send("Whoops! The Item You Are Searching For Could Not Be Found :(");
    
    const partsInCart = req.session.cart ? req.session.cart.length : 0;
    res.render('parts.ejs', {all: strs, partsInCart});
  })
});



//shopping cart webpage
app.get('/cart', (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  res.render('cart.ejs', {cart, total});
});


app.post('/cart/add/:num', async (req, res) => {
  const prtNum = req.params.num;

  parts.getByNum(prtNum, (part) => {
    if(!part) return res.status(404).send("Whoops! Part Could Not Be Found.");

    //checks if there is a session for the user
    if(!req.session.cart) req.session.cart = [];

    var existingItem = req.session.cart.find((item) => item.number === prtNum);
    if (existingItem) {
      existingItem.qty += 1;
    }
    else {
      req.session.cart.push({
        number: part.number,
        description: part.description,
        price: part.price,
        weight: part.weight,
        picture: part.picture,
        qty: 1
      });
    }

    res.redirect('/getParts');
  })
});



//removing item from cart
app.post('/cart/remove/:num', async (req, res) => {
  const prtNum = +req.params.num;

  if(!req.session.cart) req.session.cart = [];

  req.session.cart = req.session.cart.filter((item) => item.number !== prtNum);

  res.redirect('/cart');
});



//clearing the cart
app.post('/cart/clear', async (req, res) => {
  req.session.cart = [];
  res.redirect('/cart');
})


//credit form interface
const credit = require('./controllers/credit');
app.get('/checkoutPart', (req, res) => {
  res.render('credit.ejs');
})



//credit form subitted interface
app.post('/checkoutPart/processCC', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const cc = req.body.cc;
  const exp = req.body.exp;
  const amount = req.session.cart ? req.session.cart.reduce((sum, item) => sum + item.price * item.qty, 0) : 0;


  credit.processTrans({name, email, cc, exp, amount}, (result) => {
    res.render('creditResult.ejs', { data: result });
  });
});


app.listen(port, () => {
  console.log(`Listening to this bs at ${port}`)
});




//view engine
//app.set('view engine', 'ejs');

