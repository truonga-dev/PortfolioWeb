import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers } from 'react-icons/fi';
import { io } from 'socket.io-client';

const socket = io('https://portfoliowebapi.onrender.com');


const LiveVisitorCounter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    socket.emit('visitor-join');
    socket.on('visitor-count', setCount);
    return () => socket.off('visitor-count');
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 left-6 z-50 bg-dark-800 border border-white/10 rounded-2xl p-4 shadow-2xl">
      <div className="flex items-center gap-3">
        <div className="relative">
          <FiUsers size={20} className="text-green-400" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
        </div>
        <div>
          <p className="text-lg font-bold">{count}</p>
          <p className="text-xs text-gray-400">online now</p>
        </div>
      </div>
    </motion.div>
  );
};

export default LiveVisitorCounter;