const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.CORS_ORIGIN,     
  'http://localhost:5173',    
  'http://localhost:3000',
].filter(Boolean);



app.use(cors({ origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked: ${origin}`));
  }, credentials: true }))



app.use(express.json());
app.use(cookieParser())

// MongoDB Connection (cached for serverless) 
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = conn.connections[0].readyState === 1;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB error:', err);
    throw err;
  }
}

// Ensure DB is connected before handling any request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});


//  Local dev only: start the server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}



// Routes

app.use('/user', require('./routes/user'))
app.use('/finance', require('./routes/FinanceManagement'))

module.exports = app;