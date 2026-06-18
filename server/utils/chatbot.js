const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SYSTEM_PROMPT = `You are PortfolioBot, an AI assistant for Truong A's portfolio website. 
You are friendly, professional, and helpful. Answer in the same language as the user.

ABOUT TRUONG A:
- Full Name: Truong A
- Title: Full-Stack Developer
- Location: Da Nang, Vietnam
- Email: truonga01.dev@gmail.com
- Phone: +84 0347084605
- GitHub: https://github.com/truonga102005vn

SKILLS:
- Frontend: React.js, Next.js, TypeScript, Tailwind CSS, Three.js
- Backend: Node.js, Express.js, Python, FastAPI, GraphQL
- Database: MongoDB, PostgreSQL, Redis, Firebase
- DevOps: Docker, Kubernetes, GitHub Actions, AWS
- Mobile: React Native

FEATURED PROJECTS:
1. REACH Church App - Mobile & Web app for church management
2. E-Commerce Microservices - Scalable platform with Docker & Kubernetes
3. Portfolio 3D Interactive - This website!
4. AI Learning Assistant - Smart study tool using OpenAI & LangChain
5. Task Manager Pro - Kanban board with real-time collaboration
6. DevOps CI/CD Pipeline - Automated deployment system

RULES:
1. Keep responses short (2-4 sentences max)
2. Be friendly and use emojis occasionally
3. Answer in the same language as the user's question
4. Never make up false information about Truong A`;

const responseCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000;

const getAIResponse = async (userMessage) => {
  // Check cache
  const cacheKey = userMessage.toLowerCase().trim();
  const cached = responseCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('📦 Using cached response');
    return cached.response;
  }

  // No API key
  if (!GROQ_API_KEY) {
    console.log('⚠️ No Groq API key, using local responses');
    return getLocalResponse(userMessage);
  }

  try {
    console.log('🤖 Calling Groq API...');
    
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 300,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        timeout: 15000
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    console.log('✅ Groq API success');

    // Save to cache
    responseCache.set(cacheKey, {
      response: aiResponse,
      timestamp: Date.now()
    });

    return aiResponse;
  } catch (err) {
    console.error('❌ Groq API error:', err.response?.data || err.message);
    return getLocalResponse(userMessage);
  }
};

/**
 * Local fallback responses
 */
const localResponses = {
  'hello': 'Hi there! 👋 How can I help you today?',
  'hi': 'Hello! Feel free to ask me anything about Truong A.',
  'chào': 'Chào bạn! 👋 Tôi có thể giúp gì cho bạn?',
  'xin chào': 'Chào bạn! 👋 Tôi có thể giúp gì cho bạn?',
  'about': 'Truong A is a Full-Stack Developer from Da Nang, Vietnam 🇻🇳. He specializes in React, Node.js, and building modern web & mobile applications.',
  'skills': '⚛️ React.js | 🟢 Node.js | 🍃 MongoDB | 📘 TypeScript | 🐳 Docker | ☸️ Kubernetes | 🐍 Python | 📱 React Native',
  'projects': '🚀 Featured projects:\n1. REACH Church App\n2. E-Commerce Microservices\n3. Portfolio 3D (this site!)\n4. AI Learning Assistant\n5. Task Manager Pro',
  'contact': '📧 truonga01.dev@gmail.com\n📱 +84 0347084605\n📍 Da Nang, Vietnam',
  'github': '🐙 https://github.com/truonga102005vn',
  'cv': 'Click "Download CV" at the top of the page! 📄',
  'blog': 'Check out the Blog section for articles on CI/CD, React, and career tips! 📝',
};

const getLocalResponse = (message) => {
  const msg = message.toLowerCase().trim();
  for (const [key, value] of Object.entries(localResponses)) {
    if (msg.includes(key)) return value;
  }
  return 'I can tell you about Truong A\'s projects, skills, contact info, or CV. Try asking "projects", "skills", or "contact"! 💡';
};

const getWelcomeMessage = () => {
  return 'Hi! 👋 I\'m Truong A\'s AI assistant powered by Groq AI. How can I help you today?';
};

module.exports = {
  getAIResponse,
  getLocalResponse,
  getWelcomeMessage,
  localResponses
};