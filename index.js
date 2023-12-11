const express = require('express');
const mysql = require('mysql2');
const userRoutes = require('./routes/User');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors());

app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Abhiram@2004',
    database: 'db1'
});

db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
    } else {
      console.log('Connected to MySQL!');
    }
});

app.use("/auth",userRoutes);
  
app.get("/",(req,res) => {
  return res.status(200).json({
      success:true,
      message:"Server is Running..."
  });
});

app.listen(port,() => {
  console.log(`App is Running at PORT ${port}`);
});