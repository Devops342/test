const express = require('express');
const cors = require('cors');
const connectDB = require('./app/config/db');
const authRoutes = require('./app/routes/authRoutes');
const adminRoutes = require('./app/routes/adminRoutes');


const app = express();
app.use(cors());
app.use(express.json());
connectDB();


app.use('/api/auth', authRoutes);
app.use('/api/admin/users', adminRoutes);



app.listen(5000, () => {
  console.log('Server started on 5000');
});
