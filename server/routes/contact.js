const router = require('express').Router();
const Message = require('../models/Message');
const Settings = require('../models/Settings');
const nodemailer = require('nodemailer');

// Tạo transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message, budget } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, email and message are required' 
      });
    }

    // 1. Lưu vào database
    const newMessage = new Message({ name, email, subject, message, budget });
    await newMessage.save();

    // 2. Lấy thông tin profile từ Settings
    let profile = {};
    let social = {};
    try {
      const profileSettings = await Settings.findOne({ type: 'profile' });
      const socialSettings = await Settings.findOne({ type: 'social' });
      profile = profileSettings?.data || {};
      social = socialSettings?.data || {};
    } catch (err) {
      console.error('Failed to get settings:', err.message);
    }

    // 3. Gửi email xác nhận cho người dùng
    try {
      await transporter.sendMail({
        from: `"${profile?.name || 'Portfolio'}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '✅ Đã nhận được tin nhắn của bạn!',
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 20px auto; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px 30px; text-align: center;">
              <span style="font-size: 40px; display: block; margin-bottom: 15px;">👋</span>
              <h1 style="color: #fff; margin: 0; font-size: 28px;">Xin chào ${name}!</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0; font-size: 14px;">Cảm ơn bạn đã liên hệ với tôi</p>
            </div>
            <div style="padding: 30px;">
              <p style="color: #475569; line-height: 1.8; font-size: 15px;">Tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong vòng <strong>24 giờ</strong>.</p>
              <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #6366f1;">
                <p style="margin: 0 0 10px; font-weight: bold;">📌 Thông tin của tôi:</p>
                ${profile?.email ? `<p style="margin: 5px 0;">📧 Email: ${profile.email}</p>` : ''}
                ${profile?.phone ? `<p style="margin: 5px 0;">📱 Phone: ${profile.phone}</p>` : ''}
                ${profile?.location ? `<p style="margin: 5px 0;">📍 Location: ${profile.location}</p>` : ''}
                ${profile?.website ? `<p style="margin: 5px 0;">🌐 Website: ${profile.website}</p>` : ''}
              </div>
              <p style="color: #475569; font-size: 15px;">Trong lúc chờ đợi, bạn có thể xem thêm các dự án của tôi tại portfolio.</p>
              <div style="margin-top: 20px;">
                ${social?.github ? `<a href="${social.github}" style="display: inline-block; margin-right: 15px; color: #6366f1; text-decoration: none; font-size: 14px;">🐙 GitHub</a>` : ''}
                ${social?.linkedin ? `<a href="${social.linkedin}" style="display: inline-block; color: #6366f1; text-decoration: none; font-size: 14px;">💼 LinkedIn</a>` : ''}
              </div>
            </div>
            <div style="background: #1e293b; padding: 20px 30px; text-align: center;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} ${profile?.name || 'Portfolio'}. All rights reserved.</p>
              <p style="color: #94a3b8; font-size: 11px; margin: 5px 0 0;">Email này được gửi tự động từ portfolio của tôi.</p>
            </div>
          </div>
        `
      });
      console.log(`✅ Confirmation email sent to ${email}`);
    } catch (emailErr) {
      console.error('Failed to send confirmation email:', emailErr.message);
    }

    // 4. Gửi thông báo cho admin
    try {
      await transporter.sendMail({
        from: `"Portfolio Bot" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO || process.env.EMAIL_USER,
        subject: `🔔 New message from ${name}`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 20px auto; background: #0f172a; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
            <div style="background: #ef4444; padding: 20px; text-align: center;">
              <h2 style="color: #fff; margin: 0; font-size: 20px;">🔔 Tin nhắn mới!</h2>
            </div>
            <div style="padding: 20px;">
              <div style="margin-bottom: 15px;">
                <p style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0;">From</p>
                <p style="color: #e2e8f0; font-size: 15px; margin: 3px 0 0;">${name}</p>
              </div>
              <div style="margin-bottom: 15px;">
                <p style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0;">Email</p>
                <p style="color: #e2e8f0; font-size: 15px; margin: 3px 0 0;">${email}</p>
              </div>
              ${subject ? `
              <div style="margin-bottom: 15px;">
                <p style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0;">Subject</p>
                <p style="color: #e2e8f0; font-size: 15px; margin: 3px 0 0;">${subject}</p>
              </div>` : ''}
              ${budget ? `
              <div style="margin-bottom: 15px;">
                <p style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0;">Budget</p>
                <p style="color: #e2e8f0; font-size: 15px; margin: 3px 0 0;">${budget}</p>
              </div>` : ''}
              <div style="margin-bottom: 15px;">
                <p style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0;">Message</p>
                <div style="background: #1e293b; padding: 15px; border-radius: 8px; border-left: 3px solid #6366f1; margin-top: 5px;">
                  <p style="color: #cbd5e1; margin: 0;">${message}</p>
                </div>
              </div>
              <p style="color: #64748b; font-size: 12px; margin: 20px 0 0;">📅 Sent: ${new Date().toLocaleString('vi-VN')}</p>
            </div>
          </div>
        `
      });
      console.log('✅ Admin notification sent');
    } catch (emailErr) {
      console.error('Failed to send admin notification:', emailErr.message);
    }

    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully! Check your email for confirmation.' 
    });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send message. Please try again later.' 
    });
  }
});

// GET all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).select('-__v');
    res.json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update message (mark read, star, archive)
router.put('/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }
    res.json({ success: true, data: message });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE message
router.delete('/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;