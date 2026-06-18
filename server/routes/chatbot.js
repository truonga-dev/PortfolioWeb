const router = require('express').Router();
const { getAIResponse } = require('../utils/chatbot');

router.post('/', async (req, res) => {
  try {
    const { message, lang } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const langInstruction = lang === 'vi' 
      ? 'Hãy trả lời bằng tiếng Việt.' 
      : 'Please respond in English.';

    const fullMessage = `${langInstruction}\n\nUser: ${message}`;
    const response = await getAIResponse(fullMessage);
    
    res.json({ success: true, data: { response } });
  } catch (err) {
    console.error('Chatbot error:', err);
    res.status(500).json({ success: false, error: 'Failed to get response' });
  }
});

module.exports = router;