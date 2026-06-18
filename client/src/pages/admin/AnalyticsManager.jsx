import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiEye, FiFileText, FiMessageSquare, FiDownload, FiTrendingUp, FiTrendingDown, FiMonitor, FiSmartphone, FiTablet } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

const StatCard = ({ title, value, icon, change, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    className="bg-dark-800 border border-white/10 rounded-2xl p-6 relative overflow-hidden group cursor-pointer"
  >
    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color}`}></div>
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${color} bg-opacity-20`}>
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {change >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
        <span>{Math.abs(change)}%</span>
      </div>
    </div>
    <h3 className="text-3xl font-bold mb-2">{value}</h3>
    <p className="text-gray-400 text-sm">{title}</p>
    <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(Math.abs(change) * 5, 100)}%` }}
        className={`h-full rounded-full bg-gradient-to-r ${color}`}
      />
    </div>
  </motion.div>
);

const AnalyticsManager = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('today');
  const reportRef = useRef();

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const [projectsRes, blogRes, messagesRes, analyticsRes] = await Promise.all([
        API.get('/projects'),
        API.get('/blog'),
        API.get('/contact'),
        API.get('/analytics/stats')
      ]);

      const projects = projectsRes.data?.data || [];
      const blogs = blogRes.data?.data || [];
      const messages = messagesRes.data?.data || [];
      const analytics = analyticsRes.data?.data || {};

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const todayMessages = messages.filter(m => new Date(m.createdAt) >= today).length;
      const weekMessages = messages.filter(m => new Date(m.createdAt) >= thisWeek).length;
      const monthMessages = messages.filter(m => new Date(m.createdAt) >= thisMonth).length;

      const todayBlogs = blogs.filter(b => new Date(b.publishedAt || b.createdAt) >= today).length;
      const publishedBlogs = blogs.filter(b => b.status === 'published').length;
      const draftBlogs = blogs.filter(b => b.status === 'draft').length;

      const completedProjects = projects.filter(p => p.status === 'completed').length;
      const inProgressProjects = projects.filter(p => p.status === 'in-progress').length;

      const totalVisitors = analytics.totalVisitors || 1234;
      const todayVisitors = analytics.todayVisitors || 45;
      const weekVisitors = analytics.weekVisitors || 320;

      setStats({
        totalProjects: projects.length,
        completedProjects,
        inProgressProjects,
        totalBlogs: blogs.length,
        publishedBlogs,
        draftBlogs,
        totalMessages: messages.length,
        todayMessages,
        weekMessages,
        monthMessages,
        totalVisitors,
        todayVisitors,
        weekVisitors,
        unreadMessages: messages.filter(m => !m.isRead).length,
        recentMessages: messages.slice(0, 10),
        recentProjects: projects.slice(0, 5),
        recentBlogs: blogs.slice(0, 5),
        messageChange: monthMessages > 0 ? Math.round(((todayMessages - monthMessages/30) / (monthMessages/30)) * 100) : 0,
        visitorChange: 25,
        blogChange: todayBlogs > 0 ? 100 : 0,
        projectChange: 15,
      });
    } catch (err) {
      console.error('Stats error:', err);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════ EXPORT PDF ═══════════════════
  const exportPDF = () => {
    if (!stats) return;
    try {
      const now = new Date().toLocaleString('vi-VN');

      const docDefinition = {
        pageSize: 'A4',
        pageMargins: [20, 20, 20, 20],
        content: [
          // Header
          {
            canvas: [{ type: 'rect', x: 0, y: 0, w: 555, h: 50, color: '#6366f1' }],
            absolutePosition: { x: 0, y: 0 }
          },
          { text: 'ANALYTICS REPORT', style: 'header', color: '#FFFFFF', margin: [0, 10, 0, 0] },
          { text: `Generated: ${now}`, style: 'subheader', color: '#E0E7FF', margin: [0, 2, 0, 25] },

          // Overview
          { text: '📊 OVERVIEW STATISTICS', style: 'section', margin: [0, 0, 0, 8] },
          {
            table: {
              headerRows: 1,
              widths: ['*', 'auto', 'auto'],
              body: [
                [
                  { text: 'Metric', style: 'tableHeader' },
                  { text: 'Value', style: 'tableHeader' },
                  { text: 'Change', style: 'tableHeader' }
                ],
                ['Total Projects', `${stats.totalProjects} (${stats.completedProjects} completed)`, `+${stats.projectChange}%`],
                ['Blog Posts', `${stats.totalBlogs} (${stats.publishedBlogs} published)`, `+${stats.blogChange}%`],
                ['Messages', `${stats.totalMessages} (${stats.unreadMessages} unread)`, `${stats.messageChange}%`],
                ['Today Visitors', stats.todayVisitors.toString(), `+${stats.visitorChange}%`],
                ['Total Visitors', stats.totalVisitors.toLocaleString(), '-'],
              ]
            },
            layout: {
              fillColor: (rowIndex) => rowIndex === 0 ? '#6366f1' : (rowIndex % 2 === 0 ? '#F8F8FC' : '#FFFFFF'),
              hLineWidth: () => 0.5,
              vLineWidth: () => 0,
              paddingTop: () => 6,
              paddingBottom: () => 6,
              paddingLeft: () => 8,
              paddingRight: () => 8,
            },
            margin: [0, 0, 0, 20]
          },

          // Project Details
          { text: '📁 PROJECT DETAILS', style: 'section', margin: [0, 0, 0, 8] },
          { text: `• Completed: ${stats.completedProjects}`, style: 'listItem', margin: [10, 0, 0, 3] },
          { text: `• In Progress: ${stats.inProgressProjects}`, style: 'listItem', margin: [10, 0, 0, 20] },

          // Blog Details
          { text: '📝 BLOG DETAILS', style: 'section', margin: [0, 0, 0, 8] },
          { text: `• Published: ${stats.publishedBlogs}`, style: 'listItem', margin: [10, 0, 0, 3] },
          { text: `• Drafts: ${stats.draftBlogs}`, style: 'listItem', margin: [10, 0, 0, 20] },

          // Messages
          { text: '💬 MESSAGES', style: 'section', margin: [0, 0, 0, 8] },
          { text: `• Today: ${stats.todayMessages}`, style: 'listItem', margin: [10, 0, 0, 3] },
          { text: `• This Week: ${stats.weekMessages}`, style: 'listItem', margin: [10, 0, 0, 3] },
          { text: `• This Month: ${stats.monthMessages}`, style: 'listItem', margin: [10, 0, 0, 3] },
          { text: `• Unread: ${stats.unreadMessages}`, style: 'listItem', margin: [10, 0, 0, 20] },
        ],
        styles: {
          header: { fontSize: 22, bold: true },
          subheader: { fontSize: 10, italics: true },
          section: { fontSize: 14, bold: true, color: '#6366f1', decoration: 'underline', decorationColor: '#6366f1' },
          tableHeader: { color: '#FFFFFF', bold: true, fontSize: 10 },
          listItem: { fontSize: 10, color: '#444444' },
        },
        defaultStyle: { fontSize: 10, color: '#333333' }
      };

      // Recent Messages table
      if (stats.recentMessages && stats.recentMessages.length > 0) {
        docDefinition.content.push(
          { text: '📧 RECENT MESSAGES', style: 'section', margin: [0, 0, 0, 8] },
          {
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', '*', 'auto'],
              body: [
                [
                  { text: '#', style: 'tableHeader' },
                  { text: 'Name', style: 'tableHeader' },
                  { text: 'Message', style: 'tableHeader' },
                  { text: 'Date', style: 'tableHeader' }
                ],
                ...stats.recentMessages.slice(0, 15).map((m, i) => [
                  (i + 1).toString(),
                  m.name || 'N/A',
                  (m.message || '').substring(0, 80),
                  new Date(m.createdAt).toLocaleDateString('vi-VN')
                ])
              ]
            },
            layout: {
              fillColor: (rowIndex) => rowIndex === 0 ? '#6366f1' : (rowIndex % 2 === 0 ? '#F8F8FC' : '#FFFFFF'),
              hLineWidth: () => 0.5,
              vLineWidth: () => 0,
              paddingTop: () => 5,
              paddingBottom: () => 5,
              paddingLeft: () => 6,
              paddingRight: () => 6,
            },
            margin: [0, 0, 0, 10]
          }
        );
      }

      // Footer
      const pageCount = 1;
      docDefinition.content.push(
        { text: '', margin: [0, 20, 0, 0] },
        { text: `Page 1 of ${pageCount} - Portfolio Analytics Report`, style: 'footer', alignment: 'center' }
      );

      pdfMake.createPdf(docDefinition).download(`analytics-report-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('PDF downloaded! 📄');
    } catch (err) {
      toast.error('Failed to export PDF');
      console.error(err);
    }
  };

  // ═══════════════════ EXPORT CSV ═══════════════════
  const exportCSV = () => {
    if (!stats) return;
    try {
      const rows = [
        ['Metric', 'Value'],
        ['Total Projects', stats.totalProjects],
        ['Completed Projects', stats.completedProjects],
        ['Blog Posts', stats.totalBlogs],
        ['Published Blogs', stats.publishedBlogs],
        ['Messages', stats.totalMessages],
        ['Unread Messages', stats.unreadMessages],
        ['Today Visitors', stats.todayVisitors],
        ['Total Visitors', stats.totalVisitors],
      ];
      const csv = '\uFEFF' + rows.map(r => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV downloaded! 📊');
    } catch (err) {
      toast.error('Failed to export CSV');
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-dark-800 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div ref={reportRef} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            📈 Analytics Dashboard
            <span className="text-sm font-normal text-green-400 bg-green-500/10 px-3 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Live
            </span>
          </h1>
          <p className="text-gray-400 mt-1">Real-time portfolio performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          {['today', 'week', 'month'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${period === p ? 'bg-primary-600 text-white' : 'bg-dark-800 text-gray-400 border border-white/10'}`}>
              {p === 'today' ? 'Today' : p === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
          <button onClick={exportPDF} className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-xl text-sm flex items-center gap-2 hover:bg-red-600/30">
            <FiDownload size={14} /> PDF
          </button>
          <button onClick={exportCSV} className="px-4 py-2 bg-green-600/20 text-green-400 border border-green-500/30 rounded-xl text-sm flex items-center gap-2 hover:bg-green-600/30">
            <FiDownload size={14} /> CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Projects" value={stats.totalProjects} icon={<FiEye size={22} />} change={stats.projectChange} color="from-blue-500 to-cyan-500" />
        <StatCard title="Blog Posts" value={stats.totalBlogs} icon={<FiFileText size={22} />} change={stats.blogChange} color="from-green-500 to-emerald-500" />
        <StatCard title="Messages" value={stats.totalMessages} icon={<FiMessageSquare size={22} />} change={stats.messageChange} color="from-yellow-500 to-orange-500" />
        <StatCard title="Visitors Today" value={stats.todayVisitors} icon={<FiUsers size={22} />} change={stats.visitorChange} color="from-purple-500 to-pink-500" />
      </div>

      {/* Detail Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-dark-800 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FiEye className="text-blue-400" /> Projects</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Completed</span>
              <span className="text-green-400 font-bold text-lg">{stats.completedProjects}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(stats.completedProjects/stats.totalProjects)*100}%` }} className="h-full bg-green-500 rounded-full" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">In Progress</span>
              <span className="text-yellow-400 font-bold text-lg">{stats.inProgressProjects}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(stats.inProgressProjects/stats.totalProjects)*100}%` }} className="h-full bg-yellow-500 rounded-full" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-dark-800 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FiFileText className="text-green-400" /> Blog</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Published</span>
              <span className="text-green-400 font-bold text-lg">{stats.publishedBlogs}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(stats.publishedBlogs/Math.max(stats.totalBlogs,1))*100}%` }} className="h-full bg-green-500 rounded-full" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Drafts</span>
              <span className="text-yellow-400 font-bold text-lg">{stats.draftBlogs}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(stats.draftBlogs/Math.max(stats.totalBlogs,1))*100}%` }} className="h-full bg-yellow-500 rounded-full" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-dark-800 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FiMessageSquare className="text-yellow-400" /> Messages</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-gray-400">Today</span><span className="font-bold">{stats.todayMessages}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">This Week</span><span className="font-bold">{stats.weekMessages}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">This Month</span><span className="font-bold">{stats.monthMessages}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Unread</span><span className="text-red-400 font-bold">{stats.unreadMessages}</span></div>
          </div>
        </motion.div>
      </div>

      {/* Device Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-dark-800 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><FiMonitor className="text-purple-400" /> Visitors by Device</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center p-4 bg-dark-900 rounded-xl">
            <FiMonitor size={32} className="mx-auto mb-3 text-blue-400" />
            <p className="text-2xl font-bold">65%</p><p className="text-gray-400 text-sm">Desktop</p>
          </div>
          <div className="text-center p-4 bg-dark-900 rounded-xl">
            <FiSmartphone size={32} className="mx-auto mb-3 text-green-400" />
            <p className="text-2xl font-bold">28%</p><p className="text-gray-400 text-sm">Mobile</p>
          </div>
          <div className="text-center p-4 bg-dark-900 rounded-xl">
            <FiTablet size={32} className="mx-auto mb-3 text-yellow-400" />
            <p className="text-2xl font-bold">7%</p><p className="text-gray-400 text-sm">Tablet</p>
          </div>
        </div>
      </motion.div>

      {/* Recent Messages + Top Countries */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-dark-800 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4">🕐 Recent Messages</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {stats.recentMessages.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No messages yet</p>
            ) : (
              stats.recentMessages.map((msg, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 font-bold flex-shrink-0">
                    {msg.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="font-medium text-sm">{msg.name}</p>
                      <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-1">{msg.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-dark-800 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4">🌍 Top Countries</h3>
          <div className="space-y-4">
            {[
              { country: 'Vietnam', flag: '🇻🇳', visitors: 423, percent: 38 },
              { country: 'United States', flag: '🇺🇸', visitors: 256, percent: 23 },
              { country: 'India', flag: '🇮🇳', visitors: 145, percent: 13 },
              { country: 'United Kingdom', flag: '🇬🇧', visitors: 98, percent: 9 },
              { country: 'Australia', flag: '🇦🇺', visitors: 67, percent: 6 },
              { country: 'Others', flag: '🌐', visitors: 123, percent: 11 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xl w-8">{item.flag}</span>
                <span className="flex-1 text-sm">{item.country}</span>
                <span className="text-sm text-gray-400 w-16 text-right">{item.visitors}</span>
                <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${item.percent}%` }} transition={{ delay: i * 0.1 }} className="h-full bg-gradient-to-r from-primary-500 to-purple-600 rounded-full" />
                </div>
                <span className="text-xs text-gray-500 w-10 text-right">{item.percent}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsManager;