import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiMessageCircle, FiX, FiLoader, FiMic, FiMicOff, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';

const FloatingBubbles = () => {
  const bubbles = Array.from({ length: 8 }, (_, i) => ({
    id: i, size: Math.random() * 20 + 10, left: Math.random() * 100,
    delay: Math.random() * 5, duration: Math.random() * 4 + 6, opacity: Math.random() * 0.15 + 0.05,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((b) => (
        <motion.div key={b.id} className="absolute rounded-full bg-primary-500"
          style={{ width: b.size, height: b.size, left: `${b.left}%`, bottom: -20, opacity: b.opacity }}
          animate={{ y: [0, -300], x: [0, Math.random() * 40 - 20], opacity: [b.opacity, 0] }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'easeOut' }} />
      ))}
    </div>
  );
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [{ type: 'bot', text: 'Hi! 👋 I\'m Truong A\'s AI assistant. How can I help you today?' }];
  });
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const detectLanguage = (text) => { const viPattern = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i; return viPattern.test(text) ? 'vi' : 'en'; };

  const quickReplies = [
    { text: '🚀 Projects', query: 'What projects has Truong A built?' },
    { text: '💡 Skills', query: 'What are Truong A\'s skills?' },
    { text: '📧 Contact', query: 'How can I contact Truong A?' },
    { text: '📄 CV', query: 'How do I download the CV?' },
  ];

  useEffect(() => { localStorage.setItem('chatHistory', JSON.stringify(messages)); }, [messages]);
  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'vi-VN';
      recognitionRef.current.onresult = (event) => { setInput(event.results[0][0].transcript); setListening(false); };
      recognitionRef.current.onerror = () => setListening(false);
      recognitionRef.current.onend = () => setListening(false);
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) { alert('Voice input not supported.'); return; }
    listening ? recognitionRef.current.stop() : recognitionRef.current.start();
    setListening(!listening);
  };

  const handleSend = useCallback(async (messageText) => {
    const text = messageText || input.trim();
    if (!text || typing) return;
    const userMessage = text;
    if (!messageText) setInput('');
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setTyping(true);
    try {
      const lang = detectLanguage(userMessage);
      const { data } = await axios.post('https://portfoliowebapi.onrender.com/api/chatbot', { message: userMessage, lang });
      setMessages(prev => [...prev, { type: 'bot', text: data.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { type: 'bot', text: getLocalResponse(userMessage) }]);
    } finally { setTyping(false); }
  }, [input, typing]);

  const getLocalResponse = (msg) => {
    const lowerMsg = msg.toLowerCase();
    const isVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(msg);
    if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('chào')) return isVietnamese ? 'Chào bạn! 👋' : 'Hello! 👋';
    if (lowerMsg.includes('about') || lowerMsg.includes('ai')) return isVietnamese ? 'Truong A - Full-Stack Developer Đà Nẵng 🇻🇳' : 'Truong A - Full-Stack Developer Vietnam 🇻🇳';
    if (lowerMsg.includes('skill') || lowerMsg.includes('kỹ năng')) return '⚛️ React | 🟢 Node.js | 🍃 MongoDB | 📘 TypeScript | 🐳 Docker | 📱 React Native';
    if (lowerMsg.includes('project') || lowerMsg.includes('dự án')) return isVietnamese ? '🚀 REACH Church App, E-Commerce, Portfolio 3D...' : '🚀 REACH Church App, E-Commerce, Portfolio 3D...';
    if (lowerMsg.includes('contact') || lowerMsg.includes('liên hệ')) return '📧 truonga01.dev@gmail.com | 📱 +84 0347084605';
    return isVietnamese ? 'Hỏi tôi về dự án, kỹ năng, liên hệ! 💡' : 'Ask me about projects, skills, contact! 💡';
  };

  const handleQuickReply = (query) => handleSend(query);
  const clearHistory = () => { setMessages([{ type: 'bot', text: 'Hi! 👋' }]); localStorage.removeItem('chatHistory'); };

  return (
    <>
      <motion.button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary-600 rounded-full flex items-center justify-center shadow-lg" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        {isOpen ? <FiX size={24} /> : <img src="/favicon.png" alt="Chat" className="w-7 h-7 rounded-full object-cover" />}
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-dark-800 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <FloatingBubbles />
            <div className="bg-gradient-to-r from-primary-600 to-purple-600 px-4 py-3 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-white/30 overflow-hidden bg-white/20">
                  <img src="/favicon.png" alt="Logo" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="flex items-center justify-center w-full h-full text-white font-bold text-lg">T</span>'; }} />
                </div>
                <div><h3 className="font-bold">AI Assistant</h3><p className="text-xs opacity-80">Powered by Groq</p></div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={clearHistory} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-red-500/50" title="Clear"><FiTrash2 size={12} /></button>
                <button onClick={() => setIsOpen(false)} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"><FiX size={14} /></button>
              </div>
            </div>
            <div className="h-72 overflow-y-auto p-4 space-y-3 bg-dark-900/50 relative z-10">
              {messages.map((msg, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.type === 'bot' && (
                    <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden mr-2 mt-1 bg-white/10">
                      <img src="/favicon.png" alt="Bot" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.parentElement.innerHTML = '<span class="flex items-center justify-center w-full h-full text-white font-bold text-xs">T</span>'; }} />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${msg.type === 'user' ? 'bg-primary-600 text-white rounded-br-md' : 'bg-dark-700 text-gray-200 rounded-bl-md border border-white/5'}`}>{msg.text}</div>
                </motion.div>
              ))}
              {typing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                  <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden mr-2 mt-1 bg-white/10"><img src="/favicon.png" alt="Bot" className="w-full h-full object-cover" /></div>
                  <div className="bg-dark-700 text-gray-400 px-4 py-3 rounded-2xl"><div className="flex gap-1"><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span></div></div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="px-3 py-2 flex gap-2 overflow-x-auto bg-dark-800/50 border-t border-white/5 relative z-10">
              {quickReplies.map((reply, i) => (
                <button key={i} onClick={() => handleQuickReply(reply.query)} disabled={typing} className="px-3 py-1.5 bg-primary-500/15 text-primary-400 rounded-full text-xs whitespace-nowrap hover:bg-primary-500/25 flex-shrink-0 disabled:opacity-50">{reply.text}</button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 border-t border-white/10 bg-dark-800 flex gap-2 relative z-10">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={listening ? 'Đang nghe...' : 'Hỏi tôi bất cứ điều gì...'} disabled={typing || listening} className="flex-1 bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-primary-500 text-white text-sm disabled:opacity-50" />
              <button type="button" onClick={toggleVoice} className={`p-2.5 rounded-xl ${listening ? 'bg-red-500 text-white animate-pulse' : 'bg-dark-700 text-gray-400 hover:text-white'}`}>{listening ? <FiMicOff size={18} /> : <FiMic size={18} />}</button>
              <button type="submit" disabled={typing || !input.trim()} className="p-2.5 bg-primary-600 hover:bg-primary-500 rounded-xl disabled:opacity-50">{typing ? <FiLoader className="animate-spin" size={18} /> : <FiSend size={18} />}</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;