import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiStar, FiMail, FiTrash2, FiArchive, FiCheckCircle, FiCircle, FiX, FiCopy } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

const MessagesManager = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');

  const loadMessages = useCallback(async () => {
    try {
      const { data } = await API.get('/contact');
      const msgs = (data.data || []).map(m => ({
        ...m,
        isRead: m.isRead || false,
        isStarred: m.isStarred || false,
        isArchived: m.isArchived || false
      }));
      setMessages(msgs);
    } catch (err) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  useEffect(() => {
    let result = [...messages];
    if (filter === 'unread') result = result.filter(m => !m.isRead);
    if (filter === 'read') result = result.filter(m => m.isRead);
    if (filter === 'starred') result = result.filter(m => m.isStarred);
    if (filter === 'archived') result = result.filter(m => m.isArchived);
    if (filter !== 'archived') result = result.filter(m => !m.isArchived);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(m =>
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.message?.toLowerCase().includes(q) ||
        m.subject?.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFilteredMessages(result);
  }, [messages, filter, search]);

  const toggleRead = async (msg) => {
    try {
      await API.put(`/contact/${msg._id}`, { isRead: !msg.isRead });
      setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isRead: !m.isRead } : m));
    } catch (err) { toast.error('Failed to update'); }
  };

  const toggleStar = async (msg) => {
    try {
      await API.put(`/contact/${msg._id}`, { isStarred: !msg.isStarred });
      setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isStarred: !m.isStarred } : m));
    } catch (err) { toast.error('Failed to update'); }
  };

  const toggleArchive = async (msg) => {
    try {
      await API.put(`/contact/${msg._id}`, { isArchived: !msg.isArchived });
      setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isArchived: !m.isArchived } : m));
      toast.success(msg.isArchived ? 'Restored!' : 'Archived!');
    } catch (err) { toast.error('Failed to update'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message permanently?')) return;
    try {
      await API.delete(`/contact/${id}`);
      setMessages(prev => prev.filter(m => m._id !== id));
      if (selectedMessage?._id === id) setSelectedMessage(null);
      toast.success('Deleted!');
    } catch (err) { toast.error('Failed to delete'); }
  };

  const handleReply = () => {
    if (!selectedMessage) return;
    window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your message'}&body=${encodeURIComponent(replyText)}`);
    toast.success('Email client opened!');
    setReplyText('');
  };

  const copyEmail = (email) => {
    navigator.clipboard.writeText(email);
    toast.success('Email copied!');
  };

  const filters = [
    { id: 'all', label: 'All', count: messages.filter(m => !m.isArchived).length },
    { id: 'unread', label: 'Unread', count: messages.filter(m => !m.isRead && !m.isArchived).length },
    { id: 'read', label: 'Read', count: messages.filter(m => m.isRead && !m.isArchived).length },
    { id: 'starred', label: 'Starred', count: messages.filter(m => m.isStarred && !m.isArchived).length },
    { id: 'archived', label: 'Archive', count: messages.filter(m => m.isArchived).length },
  ];

  return (
    <div className="flex h-[calc(100vh-120px)] gap-6">
      {/* Left Panel - Message List */}
      <div className={`flex-1 flex flex-col min-w-0 ${selectedMessage ? 'hidden md:flex' : 'flex'}`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">💬 Messages</h1>
          <span className="text-gray-400 text-sm">{filteredMessages.length} messages</span>
        </div>

        {/* Search & Filters */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages..." className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-white/10 rounded-xl focus:border-primary-500 outline-none text-white" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                  filter === f.id ? 'bg-primary-600 text-white' : 'bg-dark-800 text-gray-400 hover:bg-dark-700 border border-white/10'
                }`}>
                {f.label}
                <span className={`text-xs px-2 py-0.5 rounded-full ${filter === f.id ? 'bg-white/20' : 'bg-white/10'}`}>{f.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {loading ? (
            [...Array(5)].map((_, i) => (<div key={i} className="bg-dark-800 border border-white/10 rounded-xl h-24 animate-pulse" />))
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-20"><p className="text-gray-400">No messages</p></div>
          ) : (
            <AnimatePresence>
              {filteredMessages.map((msg) => (
                <motion.div key={msg._id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    selectedMessage?._id === msg._id
                      ? 'bg-primary-600/20 border-primary-500'
                      : 'bg-dark-800 border-white/10 hover:border-white/20'
                  } ${!msg.isRead ? 'border-l-4 border-l-primary-500' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <button onClick={(e) => { e.stopPropagation(); toggleRead(msg); }}
                        className="mt-1 flex-shrink-0">
                        {msg.isRead ? <FiCheckCircle className="text-green-400" /> : <FiCircle className="text-primary-400" />}
                      </button>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold truncate ${!msg.isRead ? 'text-white' : 'text-gray-300'}`}>{msg.name}</h3>
                          {msg.isStarred && <FiStar className="text-yellow-400 flex-shrink-0" size={14} fill="currentColor" />}
                        </div>
                        <p className="text-sm text-gray-400 truncate">{msg.subject || 'No subject'}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 truncate pl-9">{msg.message}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Right Panel - Message Detail */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
            className="w-full md:w-96 bg-dark-800 border border-white/10 rounded-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="font-bold text-lg truncate">{selectedMessage.subject || 'Message Detail'}</h2>
              <button onClick={() => setSelectedMessage(null)} className="text-gray-400 hover:text-white md:hidden"><FiX size={20} /></button>
            </div>

            {/* Detail */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center font-bold text-lg">
                    {selectedMessage.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h3 className="font-bold">{selectedMessage.name}</h3>
                    <button onClick={() => copyEmail(selectedMessage.email)}
                      className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
                      {selectedMessage.email} <FiCopy size={12} />
                    </button>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleString() : ''}
                </span>
              </div>

              {selectedMessage.budget && (
                <div className="bg-white/5 rounded-lg p-3">
                  <span className="text-xs text-gray-400">Budget:</span>
                  <p className="font-semibold">{selectedMessage.budget}</p>
                </div>
              )}

              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              {/* Reply */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">Quick Reply</label>
                <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..." rows="4"
                  className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-lg focus:border-primary-500 outline-none resize-none text-white" />
                <button onClick={handleReply}
                  className="mt-2 w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg flex items-center justify-center gap-2 font-medium">
                  <FiMail size={16} /> Reply via Email
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-white/10 flex gap-2">
              <button onClick={() => toggleStar(selectedMessage)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1 ${
                  selectedMessage.isStarred ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 hover:bg-white/10'
                }`}>
                <FiStar size={14} fill={selectedMessage.isStarred ? 'currentColor' : 'none'} />
                {selectedMessage.isStarred ? 'Starred' : 'Star'}
              </button>
              <button onClick={() => toggleArchive(selectedMessage)}
                className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm flex items-center justify-center gap-1">
                <FiArchive size={14} />
                {selectedMessage.isArchived ? 'Restore' : 'Archive'}
              </button>
              <button onClick={() => handleDelete(selectedMessage._id)}
                className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm">
                <FiTrash2 size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessagesManager;