const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Settings = require('../models/Settings');

router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    const setting = await Settings.findOne({ type: 'password' });
    
    let isValid = false;
    if (setting?.data?.hash) {
      isValid = await bcrypt.compare(password, setting.data.hash);
    } else {
      isValid = password === 'admin123'; // Default password
    }
    
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Wrong password!' });
    }
    
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;