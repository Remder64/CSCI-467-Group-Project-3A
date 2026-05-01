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
  if (req.body.quantity == 0) {
      res.redirect('/getParts');
  }

  const prtNum = req.params.num;

  parts.getByNum(prtNum, (part) => {
    if(!part) return res.status(404).send("Whoops! Part Could Not Be Found.");

    //checks if there is a session for the user
    if(!req.session.cart) req.session.cart = [];

    var existingItem = req.session.cart.find((item) => item.number == prtNum);
    console.log(existingItem);
    if (existingItem) {
      existingItem.qty = +existingItem.qty + +req.body.quantity;
    }
    else {
      req.session.cart.push({
        number: part.number,
        description: part.description,
        price: part.price,
        weight: part.weight,
        picture: part.picture,
        qty: req.body.quantity
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


//desk
const id = require('./controllers/database2');
app.get('/desk', (req, res) => {
  id.partID((list) => {
    const partsininv = req.session.inventory ? req.session.inventory.length : 0;
    res.render('desk', {all: list, partsininv});
  });
}); 


//desk change quantity at the id
app.use(express.urlencoded({ extended: true }));
app.post('/desk/:partNumber', async (req, res) => {
  const currentid = req.params.partNumber;
  const newquantity = req.body.quantity;
  console.log(req.body.quantity);

  id.ChangeQuantity(currentid, newquantity);
  
  res.redirect('/desk');
});

// ── WAREHOUSE WORKER ───────────────────────────────────
//view all authorized customer orders
app.get('/warehouse', (req, res) => {
  id.getAuthorizedOrders((orders) => {
    res.render('warehouse', { orders });
  });
});

//work on a customer's order
app.get('/warehouse/order/:orderID', (req, res) => {
  const orderID = req.params.orderID;
  id.getOrderByID(orderID, (order) => {
    id.getOrderItems(orderID, (items) => {
      if (items.length === 0) return res.render('warehouse', { order, items: [] });
      let enriched = [...items];
      let done = 0;
      items.forEach((item, idx) => {
        parts.getByNum(item.partNumber, (part) => {
          enriched[idx].description = part ? part.description : 'Unknown';
          done++;
          if (done === items.length) res.render('warehouse', { order, items: enriched });
        });
      });
    });
  });
});

//ship and send email after completed order
app.post('/warehouse/order/:orderID/ship', (req, res) => {
  const orderID = req.params.orderID;
  id.getOrderByID(orderID, (order) => {
    id.shipOrder(orderID, () => {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: { user: 'your@email.com', pass: 'yourpassword' } // update these
      });
      transporter.sendMail({
        from:    'no-reply@autoparts.com',
        to:      order.custEmail,
        subject: `Order #${orderID} has shipped!`,
        text:    `Hi ${order.custName},\n\nYour order #${orderID} has shipped to:\n${order.custAddress}, ${order.custCity}, ${order.custState} ${order.custZip}\n\nThank you!`
      }).catch(err => console.error('Email error:', err.message));
      res.redirect('/warehouse');
    });
  });
});


app.listen(port, () => {
  console.log(`Listening to this bs at ${port}`)
});




//view engine
//app.set('view engine', 'ejs');

