const router = require('express').Router();
const Visitor = require('../models/Visitor');

// Track visitor
router.post('/track', async (req, res) => {
  try {
    const { userAgent, page, referrer } = req.body;
    
    const visitor = new Visitor({
      ip: req.ip,
      userAgent: userAgent || req.headers['user-agent'],
      page: page || '/',
      referrer: referrer || req.headers.referer || '',
      timestamp: new Date()
    });
    
    await visitor.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get stats
router.get('/stats', async (req, res) => {
  try {
    const totalVisitors = await Visitor.countDocuments();
    const todayVisitors = await Visitor.countDocuments({
      timestamp: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    
    const recentVisitors = await Visitor.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .select('-__v');

    res.json({
      success: true,
      data: {
        totalVisitors,
        todayVisitors,
        recentVisitors
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;