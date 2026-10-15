// David's Kitchen backend: Express API with JSON-file persistence.
// This is a beginner-friendly demo backend, not a production payment system.
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

app.use(express.json({ limit: '100kb' }));
// Never expose saved customer orders/messages through the static file server.
app.use('/data', (req, res) => res.status(404).json({error:'Not found.'}));
app.use(express.static(__dirname, { extensions: ['html'] }));

const menu = [
 {id:1,name:"David's Kitchen Jollof Rice",category:'Rice',price:4500},
 {id:2,name:'Fried Rice & Chicken',category:'Main Meals',price:5200},
 {id:3,name:'Grilled Chicken',category:'Chicken',price:6500},
 {id:4,name:'Beef Suya',category:'Beef',price:5500},
 {id:5,name:'Grilled Fish',category:'Fish',price:7500},
 {id:6,name:'Yam & Egg Sauce',category:'Breakfast',price:3500},
 {id:7,name:'Chicken & Chips',category:'Snacks',price:5000},
 {id:8,name:"David's Kitchen Burger",category:'Snacks',price:4800},
 {id:9,name:'Fresh Fruit Juice',category:'Drinks',price:2500},
 {id:10,name:'Chocolate Cake',category:'Desserts',price:3000},
 {id:11,name:'Moi Moi',category:'Breakfast',price:2800},
 {id:12,name:'Peppered Chicken',category:'Chicken',price:6200}
];

function ensureDataFiles() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  for (const file of [ORDERS_FILE, MESSAGES_FILE]) {
    if (!fs.existsSync(file)) fs.writeFileSync(file, '[]\n', 'utf8');
  }
}
function readRecords(file) {
  ensureDataFiles();
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { throw new Error('Saved data could not be read. Check the data folder.'); }
}
function writeRecords(file, records) {
  ensureDataFiles();
  const temp = file + '.tmp';
  fs.writeFileSync(temp, JSON.stringify(records, null, 2) + '\n', 'utf8');
  fs.renameSync(temp, file);
}
function cleanText(value, max = 500) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}
function validEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }

app.get('/api/health', (req, res) => res.json({status:'ok',service:"David's Kitchen API"}));
app.get('/api/menu', (req, res) => res.json({items:menu}));

app.post('/api/orders', (req, res) => {
  const body = req.body || {};
  const c = body.customer || {};
  const customer = {
    name: cleanText(c.name, 100), phone: cleanText(c.phone, 40),
    email: cleanText(c.email, 160), address: cleanText(c.address, 250),
    city: cleanText(c.city, 100), state: cleanText(c.state, 100),
    instructions: cleanText(c.instructions, 500)
  };
  if (!customer.name || !customer.phone || !customer.email || !customer.address || !customer.city || !customer.state) {
    return res.status(400).json({error:'Please complete all required customer and delivery fields.'});
  }
  if (!validEmail(customer.email)) return res.status(400).json({error:'Please enter a valid email address.'});
  const paymentMethod = cleanText(body.paymentMethod, 50);
  const allowedPayments = ['Pay on Delivery','Bank Transfer','Online Payment (demo)'];
  if (!allowedPayments.includes(paymentMethod)) return res.status(400).json({error:'Choose a valid payment method.'});
  if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 30) {
    return res.status(400).json({error:'Your cart is empty or contains too many items.'});
  }
  const items = [];
  for (const entry of body.items) {
    const product = menu.find(item => item.id === Number(entry.id));
    const quantity = Number(entry.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
      return res.status(400).json({error:'One of the cart items or quantities is invalid. Please refresh and try again.'});
    }
    items.push({id:product.id,name:product.name,price:product.price,quantity,lineTotal:product.price*quantity});
  }
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const deliveryFee = 2000;
  const now = new Date();
  const order = {
    id: crypto.randomUUID(), orderNumber: 'DAV-' + now.getTime().toString().slice(-7),
    createdAt: now.toISOString(), status:'Received', customer, paymentMethod,
    items, subtotal, deliveryFee, total:subtotal+deliveryFee
  };
  try {
    const orders = readRecords(ORDERS_FILE);
    orders.push(order);
    writeRecords(ORDERS_FILE, orders);
    return res.status(201).json({message:'Order received.',orderNumber:order.orderNumber,total:order.total,status:order.status});
  } catch (error) {
    console.error('Order save error:', error.message);
    return res.status(500).json({error:'The order could not be saved. Please try again.'});
  }
});

app.post('/api/contact', (req, res) => {
  const body = req.body || {};
  const message = {
    id: crypto.randomUUID(), createdAt:new Date().toISOString(),
    name:cleanText(body.name,100), email:cleanText(body.email,160),
    subject:cleanText(body.subject,160), message:cleanText(body.message,2000)
  };
  if (!message.name || !validEmail(message.email) || !message.message) {
    return res.status(400).json({error:'Please provide your name, a valid email address, and a message.'});
  }
  try {
    const messages = readRecords(MESSAGES_FILE);
    messages.push(message);
    writeRecords(MESSAGES_FILE, messages);
    return res.status(201).json({message:'Your message was received.'});
  } catch (error) {
    console.error('Contact save error:', error.message);
    return res.status(500).json({error:'Your message could not be saved. Please try again.'});
  }
});

app.use('/api', (req, res) => res.status(404).json({error:'API route not found.'}));
app.listen(PORT, () => {
  ensureDataFiles();
  console.log(`David's Kitchen is running at http://localhost:${PORT}`);
  console.log('API health check: http://localhost:' + PORT + '/api/health');
});
