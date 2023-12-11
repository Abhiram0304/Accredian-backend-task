const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Abhiram@2004',
    database: 'db1'
});

exports.signup = async(req,res) => {
  try{
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res.status(403).json({
        success: false,
        message: "Invalid Data Input"
      });
    }

    db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], async (err, rows) => {
      if (err) {
        console.error('Error checking existing user:', err);
        return res.status(500).send('Internal Server Error');
      }

      if (rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Username or Email Already Exists"
        });
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Both Passwords Do Not Match"
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into the database
      db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err, result) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).send('Internal Server Error');
        }

        // Return success response
        return res.status(200).json({
          success: true,
          message: "User Registered Successfully"
        });
      });
    });
  } 
  catch(e){
    console.log(e.message);
    return res.status(401).json({
      success: false,
      message: "Cannot Sign Up"
    });
  }
}

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(403).json({
        success: false,
        message: "Invalid Data Input"
      });
    }

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, rows) => {
      if (err) {
        console.error('Error checking user:', err);
        return res.status(500).send('Internal Server Error');
      }

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User Not Found"
        });
      }

      const isPasswordMatch = await bcrypt.compare(password, rows[0].password);

      if (!isPasswordMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid Password"
        });
      }

      const token = jwt.sign({ userId: rows[0].id, username: rows[0].username }, 'Abhiram', { expiresIn: '1h' });

      return res.status(200).json({
        success: true,
        message: "Login Successful",
        token: token
      });
    });
  } catch (e) {
    console.log(e.message);
    return res.status(401).json({
      success: false,
      message: "Cannot Log In"
    });
  }
};

exports.getUserByEmail = (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, rows) => {
      if (err) {
        console.error('Error fetching user by email:', err);
        return res.status(500).send('Internal Server Error');
      }

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User Not Found"
        });
      }

      const user = rows[0];
      return res.status(200).json({
        success: true,
        user: user
      });
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};