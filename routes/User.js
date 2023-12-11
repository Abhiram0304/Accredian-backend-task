const express = require("express");
const router = express.Router();

const {signup,login,getUserByEmail} = require('../controllers/Auth');
const {auth} = require('../middleware/Auth');

router.post("/login",login);
router.post("/signup",signup);
router.post('/getDetails',getUserByEmail);

module.exports = router;