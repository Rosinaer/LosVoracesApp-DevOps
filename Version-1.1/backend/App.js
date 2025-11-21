const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const path = require('path');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


// Rutas
const AuthRoute = require('./routes/AuthRoute');
const BookRoute = require('./routes/BookRoute');
const MagazineRoute = require('./routes/MagazineRoute');
const SchoolSupplyRoute = require('./routes/SchoolSupplyRoute');
const OrderRoute = require('./routes/OrderRoute');
const SaleRoute = require('./routes/SaleRoute');
const SupplierRoute = require('./routes/SupplierRoute');
const DashboardRoute = require('./routes/DashboardRoute');

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))  
  .catch(err => console.error(err));


const whitelist = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://los-voraces-app-frontend.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    const isVercelPreview = origin?.endsWith('.vercel.app');

    if (!origin) {
      
      callback(null, true);
    } else if (whitelist.includes(origin) || isVercelPreview) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Middleware para parsear JSON 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para cookies
const cookieParser = require('cookie-parser');
app.use(cookieParser());


app.use(express.static('public'));


app.get('/', (req, res) => {
  res.status(200).json({ message: 'API funcionando correctamente' });
});

// Rutas principales
app.use('/auth', AuthRoute);
app.use('/book', BookRoute);
app.use('/magazine', MagazineRoute);
app.use('/schoolSupply', SchoolSupplyRoute);
app.use('/order', OrderRoute);
app.use('/sale', SaleRoute);
app.use('/supplier', SupplierRoute);
app.use('/', DashboardRoute);

// Iniciar servidor solo si se ejecuta directamente
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
  });
}

module.exports = app;
