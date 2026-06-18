const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Settings = require('../models/Settings');

// GET all settings (public)
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.find();
    const result = {};
    settings.forEach(s => { result[s.type] = s.data; });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET public profile (for frontend portfolio)
router.get('/public', async (req, res) => {
  try {
    const profile = await Settings.findOne({ type: 'profile' });
    const social = await Settings.findOne({ type: 'social' });
    res.json({
      success: true,
      data: {
        profile: profile?.data || {},
        social: social?.data || {}
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT profile
router.put('/profile', async (req, res) => {
  try {
    let setting = await Settings.findOne({ type: 'profile' });
    if (setting) {
      setting.data = { ...setting.data, ...req.body };
      setting.updatedAt = new Date();
    } else {
      setting = new Settings({ type: 'profile', data: req.body });
    }
    await setting.save();
    res.json({ success: true, message: 'Profile updated', data: setting.data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT password
router.put('/password', async (req, res) => {
  try {
    const { current, new: newPassword } = req.body;
    let setting = await Settings.findOne({ type: 'password' });
    
    // Verify current password
    const currentHash = setting?.data?.hash || '';
    const isMatch = currentHash ? await bcrypt.compare(current, currentHash) : (current === 'admin123');
    
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hash = await bcrypt.hash(newPassword, 10);
    
    if (setting) {
      setting.data = { hash };
    } else {
      setting = new Settings({ type: 'password', data: { hash } });
    }
    await setting.save();
    res.json({ success: true, message: 'Password changed' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT social
router.put('/social', async (req, res) => {
  try {
    let setting = await Settings.findOne({ type: 'social' });
    if (setting) {
      setting.data = { ...setting.data, ...req.body };
    } else {
      setting = new Settings({ type: 'social', data: req.body });
    }
    await setting.save();
    res.json({ success: true, message: 'Social links updated', data: setting.data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT SEO
router.put('/seo', async (req, res) => {
  try {
    let setting = await Settings.findOne({ type: 'seo' });
    if (setting) {
      setting.data = { ...setting.data, ...req.body };
    } else {
      setting = new Settings({ type: 'seo', data: req.body });
    }
    await setting.save();
    res.json({ success: true, message: 'SEO settings updated', data: setting.data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;