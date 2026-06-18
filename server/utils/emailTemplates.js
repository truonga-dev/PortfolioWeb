const contactConfirmation = (name) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px 30px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 28px; }
    .header p { color: #e0e7ff; margin: 10px 0 0; font-size: 14px; }
    .body { padding: 30px; }
    .body p { color: #475569; line-height: 1.8; font-size: 15px; }
    .highlight { background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #6366f1; }
    .footer { background: #1e293b; padding: 20px 30px; text-align: center; }
    .footer p { color: #94a3b8; font-size: 12px; margin: 0; }
    .footer a { color: #6366f1; text-decoration: none; }
    .emoji { font-size: 40px; display: block; margin-bottom: 15px; }
    .social-links { margin-top: 20px; }
    .social-links a { display: inline-block; margin: 0 10px; color: #6366f1; text-decoration: none; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="emoji">👋</span>
      <h1>Xin chào ${name}!</h1>
      <p>Cảm ơn bạn đã liên hệ với tôi</p>
    </div>
    <div class="body">
      <p>Tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong vòng <strong>24 giờ</strong>.</p>
      <div class="highlight">
        <p style="margin:0;"><strong>📌 Thông tin của tôi:</strong></p>
        <p style="margin:10px 0 0;">📧 Email: your-email@gmail.com</p>
        <p style="margin:5px 0;">📱 Phone: +84 123 456 789</p>
        <p style="margin:5px 0;">🌐 Website: yourname.dev</p>
      </div>
      <p>Trong lúc chờ đợi, bạn có thể xem thêm các dự án của tôi tại portfolio.</p>
      <div class="social-links">
        <a href="https://github.com/yourname">🐙 GitHub</a>
        <a href="https://linkedin.com/in/yourname">💼 LinkedIn</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Truong A. All rights reserved.</p>
      <p>Email này được gửi tự động từ portfolio của tôi.</p>
    </div>
  </div>
</body>
</html>
`;

const adminNotification = (data) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #1e293b; margin: 0; padding: 0; }
    .container { max-width: 500px; margin: 20px auto; background: #0f172a; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
    .header { background: #ef4444; padding: 20px; text-align: center; }
    .header h2 { color: #fff; margin: 0; font-size: 20px; }
    .body { padding: 20px; }
    .field { margin-bottom: 15px; }
    .label { color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
    .value { color: #e2e8f0; font-size: 15px; margin-top: 3px; }
    .message-box { background: #1e293b; padding: 15px; border-radius: 8px; border-left: 3px solid #6366f1; margin-top: 10px; color: #cbd5e1; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🔔 New Contact Message!</h2>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">From</div>
        <div class="value">${data.name}</div>
      </div>
      <div class="field">
        <div class="label">Email</div>
        <div class="value">${data.email}</div>
      </div>
      ${data.subject ? `
      <div class="field">
        <div class="label">Subject</div>
        <div class="value">${data.subject}</div>
      </div>` : ''}
      ${data.budget ? `
      <div class="field">
        <div class="label">Budget</div>
        <div class="value">${data.budget}</div>
      </div>` : ''}
      <div class="field">
        <div class="label">Message</div>
        <div class="message-box">${data.message}</div>
      </div>
      <p style="color:#64748b; font-size:12px; margin-top:20px;">📅 Sent: ${new Date().toLocaleString('vi-VN')}</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = { contactConfirmation, adminNotification };