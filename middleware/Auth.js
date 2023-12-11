const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Abhiram@2004',
    database: 'db1'
});

exports.auth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is Missing"
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);

      db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (err, rows) => {
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

        req.user = rows[0];
        next();
      });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Token is Invalid"
      });
    }
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({
      success: false,
      message: "Something Went Wrong"
    });
  }
};