const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
const config = require('../config/config.js');

router.get('/', function(req, res) {
  return res.json({ message: 'Up service SISMIP' });
});

module.exports = router;
