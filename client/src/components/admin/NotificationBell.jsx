import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiX } from 'react-icons/fi';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    socket.on('admin-notification', (data) => {
      setNotifications(prev => [data, ...prev].slice(0, 10));
      setUnread(prev => prev + 1);
    });

    return () => socket.off('admin-notification');
  }, []);

  const clearAll = () => {
    setNotifications([]);
    setUnread(0);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button onClick={() => { setIsOpen(!isOpen); setUnread(0); }} className="relative text-gray-400 hover:text-white">
        <FiBell size={20} />
        {unread > 0 && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
            {unread}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-80 bg-dark-800 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-bold">Notifications</h3>
              <button onClick={clearAll} className="text-xs text-gray-400 hover:text-white">Clear all</button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No notifications</p>
              ) : (
                notifications.map((n, i) => (
                  <div key={i} className="p-4 border-b border-white/5 hover:bg-white/5">
                    <p className="text-sm">{n.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(n.time).toLocaleTimeString()}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;