import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiFileText, FiMessageSquare, FiUsers, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import axios from 'axios';

const API = axios.create({ baseURL: 'https://portfoliowebapi.onrender.com/api' });

const StatCard = ({ title, value, icon, change, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-dark-800 border border-white/10 rounded-2xl p-6 hover:border-primary-500/50 transition-all duration-300"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-sm ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
        {change > 0 ? <FiTrendingUp /> : <FiTrendingDown />}
        <span>{Math.abs(change)}%</span>
      </div>
    </div>
    <h3 className="text-3xl font-bold mb-1">{value}</h3>
    <p className="text-gray-400 text-sm">{title}</p>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0, blogs: 0, messages: 0, visitors: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadStats();
    loadRecentActivity();
  }, []);

  const loadStats = async () => {
    try {
      const [projects, blogs, messages, analytics] = await Promise.all([
        API.get('/projects'),
        API.get('/blog'),
        API.get('/contact'),
        API.get('/analytics/stats')
      ]);

      setStats({
        projects: projects.data?.data?.length || projects.data?.count || 0,
        blogs: blogs.data?.data?.length || blogs.data?.count || 0,
        messages: messages.data?.data?.length || messages.data?.count || 0,
        visitors: analytics.data?.data?.totalVisitors || 0
      });
    } catch (err) {
      console.error('Load stats error:', err);
    }
  };

  const loadRecentActivity = async () => {
    try {
      const { data } = await API.get('/contact');
      setRecentActivity(data.data?.slice(0, 5) || []);
    } catch (err) {
      console.error('Load activity error:', err);
    }
  };

  const cards = [
    { title: 'Total Projects', value: stats.projects, icon: <FiCode size={24} />, change: 15, color: 'bg-blue-500/20 text-blue-400' },
    { title: 'Blog Posts', value: stats.blogs, icon: <FiFileText size={24} />, change: 20, color: 'bg-green-500/20 text-green-400' },
    { title: 'Messages', value: stats.messages, icon: <FiMessageSquare size={24} />, change: -5, color: 'bg-yellow-500/20 text-yellow-400' },
    { title: 'Visitors', value: stats.visitors, icon: <FiUsers size={24} />, change: 30, color: 'bg-purple-500/20 text-purple-400' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">📊 Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-800 border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold mb-4">📈 Visitors Overview</h3>
          <div className="h-64 flex items-end gap-2">
            {[20, 35, 45, 30, 60, 55, 70, 50, 65, 75, 60, 80].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.1 }}
                className="flex-1 bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg"
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-400">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
            <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
            <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-800 border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold mb-4">🔥 Recent Messages</h3>
          {recentActivity.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No messages yet</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((msg, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-10 h-10 bg-primary-600/20 rounded-full flex items-center justify-center text-primary-400 font-bold">
                    {msg.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{msg.name}</p>
                      <span className="text-xs text-gray-500">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;