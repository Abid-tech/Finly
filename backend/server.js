const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')

dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }))
app.use(express.json());
app.use(cookieParser())


// Start server 
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));



// Routes

app.use('/user', require('./routes/user'))
app.use('/finance', require('./routes/FinanceManagement'))