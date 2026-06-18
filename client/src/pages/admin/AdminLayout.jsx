import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome, FiCode, FiBarChart2, FiFileText, FiMessageSquare,
  FiUsers, FiSettings, FiLogOut, FiMenu, FiX, FiBell, FiSearch
} from 'react-icons/fi';
import NotificationBell from '../../components/admin/NotificationBell';


const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiHome size={20} />, path: '/admin/dashboard' },
    { id: 'projects', label: 'Projects', icon: <FiCode size={20} />, path: '/admin/dashboard/projects' },
    { id: 'skills', label: 'Skills', icon: <FiBarChart2 size={20} />, path: '/admin/dashboard/skills' },
    { id: 'blog', label: 'Blog', icon: <FiFileText size={20} />, path: '/admin/dashboard/blog' },
    { id: 'messages', label: 'Messages', icon: <FiMessageSquare size={20} />, path: '/admin/dashboard/messages' },
    { id: 'visitors', label: 'Visitors', icon: <FiUsers size={20} />, path: '/admin/dashboard/visitors' },
    { id: 'settings', label: 'Settings', icon: <FiSettings size={20} />, path: '/admin/dashboard/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 256 : 80 }}
        className="bg-dark-900 border-r border-white/10 flex flex-col fixed h-full z-30 transition-all duration-300"
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          {sidebarOpen && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-purple-600 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-600/20 transition-colors"
          >
            <FiLogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="bg-dark-900/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-20">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <FiSearch className="text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search anything..."
                className="bg-transparent outline-none text-gray-300 w-full placeholder-gray-500"
              />
            </div>

            <div className="flex items-center gap-4">
            <NotificationBell />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm font-bold">
                  A
                </div>
                <span className="text-gray-300">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;