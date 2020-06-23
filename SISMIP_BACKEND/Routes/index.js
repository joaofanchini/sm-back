const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  return res.json({ message: 'Up service SISMIP' });
});

module.exports = router;
