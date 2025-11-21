const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', './views');

const BookRoute = require('./routes/BookRoute');
const MagazineRoute = require('./routes/MagazineRoute');
// const ProductRoute = require('./routes/ProductRoute');
const SchoolSupplyRoute = require('./routes/SchoolSupplyRoute');
const OrderRoute = require('./routes/OrderRoute');
const SaleRoute = require('./routes/SaleRoute');
const SupplierRoute = require('./routes/SupplierRoute');

// Middleware
app.use(express.json()); 

// Root route
app.get('/', (req, res) => {
  res.render('home');
});

// RUTAS 
app.use('/book', BookRoute);
app.use('/magazine', MagazineRoute);
// app.use('/product', ProductRoute);
app.use('/schoolSupply', SchoolSupplyRoute);
app.use('/order', OrderRoute);
app.use('/sale', SaleRoute);
app.use('/supplier', SupplierRoute);

// Only start the server if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
  });
}

module.exports = app;