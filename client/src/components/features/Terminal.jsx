import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const Terminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', content: 'Welcome to my interactive terminal! 🚀' },
    { type: 'system', content: 'Type "help" to see available commands.' },
    { type: 'system', content: '─'.repeat(50) },
  ]);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  const commands = {
    help: `Available commands:
  about     - Learn about me
  skills    - View my technical skills
  projects  - See my projects
  contact   - Get my contact info
  clear     - Clear the terminal
  date      - Show current date
  whoami    - Display current user
  social    - My social links
  fun       - Something fun!`,
    
    about: '👨‍💻 Software Engineer | Full Stack Developer | Open Source Enthusiast | Student at University of Technology',
    
    skills: `
┌─────────────┬─────────────┬─────────────┐
│  Frontend   │   Backend   │   DevOps    │
├─────────────┼─────────────┼─────────────┤
│ React ⭐⭐⭐⭐⭐ │ Node.js ⭐⭐⭐⭐│ Docker ⭐⭐⭐  │
│ Next.js ⭐⭐⭐⭐│ Python ⭐⭐⭐  │ Git ⭐⭐⭐⭐⭐   │
│ TypeScript⭐⭐⭐⭐│ MongoDB ⭐⭐⭐⭐│ AWS ⭐⭐      │
└─────────────┴─────────────┴─────────────┘`,
    
    projects: `
🚀 My Projects:
  1. AI Chatbot for Students (Python/OpenAI)
  2. E-Commerce Microservices (MERN Stack)
  3. Portfolio 3D Interactive (React/Three.js)
  4. Task Management App (React Native)
  
Type 'project 1' for more details.`,
    
    'project 1': 'AI Chatbot - Built with Python, LangChain & OpenAI API. Features: natural language processing, context awareness, integration with university systems.',
    'project 2': 'E-Commerce Platform - Microservices architecture with Node.js, Docker, Kubernetes. Features: real-time inventory, payment processing, admin dashboard.',
    'project 3': 'Portfolio 3D - Built with React, Three.js & Framer Motion. Features: interactive 3D elements, terminal emulator, mini apps.',
    
    contact: `
📧 Email:   your.email@example.com
💼 LinkedIn: linkedin.com/in/yourname
🐱 GitHub:   github.com/yourname
🐦 Twitter:  @yourname
📍 Location: Ho Chi Minh City, Vietnam`,
    
    whoami: 'nguyen-van-a@portfolio:~$',
    
    date: new Date().toLocaleString(),
    
    social: `
🔗 My Links:
  • GitHub:   https://github.com/yourname
  • LinkedIn: https://linkedin.com/in/yourname
  • Twitter:  https://twitter.com/yourname
  • Dev.to:   https://dev.to/yourname`,
    
    fun: `
🎉 Random Fun Facts:
  • I've written over 100,000 lines of code
  • My first program was a calculator in C++
  • I love solving Rubik's cubes (record: 2 minutes)
  • Favorite coding snack: Coffee + Chocolate 🍫☕
  
Why do programmers prefer dark mode?
Because light attracts bugs! 🐛`,
    
    hello: 'Hello! How can I help you today? 😊',
    hi: 'Hi there! Feel free to explore my portfolio! 🎉',
  };

  const handleCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    // Clear command
    if (trimmedCmd === 'clear' || trimmedCmd === 'cls') {
      setHistory([]);
      return;
    }

    // Add user input to history
    const newHistory = [...history, { type: 'input', content: `visitor@portfolio:~$ ${cmd}` }];

    // Check if command exists
    if (commands[trimmedCmd]) {
      newHistory.push({ type: 'output', content: commands[trimmedCmd] });
    } else if (trimmedCmd !== '') {
      newHistory.push({ 
        type: 'error', 
        content: `Command not found: '${trimmedCmd}'. Type 'help' for available commands.` 
      });
    }

    setHistory(newHistory);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input);
      setInput('');
    }
  };

  // Auto scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <motion.div
      className="bg-dark-900/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden w-full max-w-lg shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Terminal Header */}
      <div className="bg-dark-800 px-4 py-2 flex items-center gap-2 border-b border-white/10">
        <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 cursor-pointer transition-colors" />
        <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 cursor-pointer transition-colors" />
        <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 cursor-pointer transition-colors" />
        <span className="text-xs text-gray-400 ml-2 font-mono">visitor@portfolio — bash — 80×24</span>
      </div>

      {/* Terminal Body */}
      <div
        ref={terminalRef}
        className="h-48 overflow-y-auto p-4 font-mono text-xs md:text-sm cursor-text"
        onClick={() => inputRef.current?.focus()}
        style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}
      >
        {/* History */}
        {history.map((item, index) => (
          <div key={index} className="mb-1 leading-relaxed">
            {item.type === 'input' && (
              <span className="text-green-400">{item.content}</span>
            )}
            {item.type === 'output' && (
              <pre className="text-gray-300 whitespace-pre-wrap font-mono my-1">{item.content}</pre>
            )}
            {item.type === 'error' && (
              <span className="text-red-400">{item.content}</span>
            )}
            {item.type === 'system' && (
              <span className="text-blue-400">{item.content}</span>
            )}
          </div>
        ))}

        {/* Input Line */}
        <form onSubmit={handleSubmit} className="flex items-center mt-1">
          <span className="text-green-400 mr-2 font-mono">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-300 font-mono"
            spellCheck={false}
            autoComplete="off"
            placeholder="Type a command..."
          />
        </form>
      </div>
    </motion.div>
  );
};

export default Terminal;