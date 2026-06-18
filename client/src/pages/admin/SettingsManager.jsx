import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSave, FiCamera, FiLock, FiGlobe, FiLink, FiUser, FiMail,
  FiPhone, FiMapPin, FiFileText, FiUpload, FiTrash2, FiCheck,
  FiShield, FiZap, FiBell, FiMoon, FiSun, FiActivity,
  FiServer, FiDatabase, FiHardDrive, FiCpu, FiAlertCircle
} from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = axios.create({ baseURL: 'https://portfoliowebapi.onrender.com/api' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const SettingsManager = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successAnimation, setSuccessAnimation] = useState(false);
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: '', email: '', phone: '', location: '', bio: '', title: '',
    avatar: null, cvFile: null, website: '', company: '', github: ''
  });

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [social, setSocial] = useState({
    github: '', linkedin: '', twitter: '', devto: '', website: '',
    facebook: '', instagram: '', youtube: '', stackoverflow: '', medium: ''
  });

  const [seo, setSeo] = useState({
    siteTitle: '', metaDescription: '', googleAnalytics: '', keywords: '',
    ogImage: '', twitterHandle: '', robotsTxt: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    newMessageAlert: true,
    commentAlert: true
  });

  const [systemInfo] = useState({
    nodeVersion: '18.x',
    databaseSize: '24.5 MB',
    uptime: '3 days 12 hours',
    lastBackup: '2025-06-17',
    cpuUsage: '23%',
    memoryUsage: '45%'
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await API.get('/settings');
        if (data.success && data.data) {
          if (data.data.profile) setProfile(prev => ({ ...prev, ...data.data.profile }));
          if (data.data.social) setSocial(prev => ({ ...prev, ...data.data.social }));
          if (data.data.seo) setSeo(prev => ({ ...prev, ...data.data.seo }));
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  // Password strength checker
  useEffect(() => {
    let strength = 0;
    if (passwords.new.length >= 8) strength++;
    if (/[A-Z]/.test(passwords.new)) strength++;
    if (/[0-9]/.test(passwords.new)) strength++;
    if (/[^A-Za-z0-9]/.test(passwords.new)) strength++;
    setPasswordStrength(strength);
  }, [passwords.new]);

  const { getRootProps: getAvatarRootProps, getInputProps: getAvatarInputProps } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }, maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const reader = new FileReader();
      reader.onload = () => setProfile({ ...profile, avatar: reader.result });
      reader.readAsDataURL(acceptedFiles[0]);
      toast.success('Avatar uploaded!');
    }
  });

  const { getRootProps: getCVRootProps, getInputProps: getCVInputProps } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setProfile({ ...profile, cvFile: acceptedFiles[0] });
      toast.success('CV uploaded!');
    }
  });

  const showSuccess = () => {
    setSuccessAnimation(true);
    setTimeout(() => setSuccessAnimation(false), 2000);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try { await API.put('/settings/profile', profile); toast.success('Profile updated!'); showSuccess(); }
    catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return toast.error('Passwords do not match!');
    if (passwords.new.length < 8) return toast.error('Password must be at least 8 characters!');
    setSaving(true);
    try {
      await API.put('/settings/password', passwords);
      toast.success('Password changed!');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const handleSaveSocial = async () => {
    setSaving(true);
    try { await API.put('/settings/social', social); toast.success('Links updated!'); showSuccess(); }
    catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const handleSaveSEO = async () => {
    setSaving(true);
    try { await API.put('/settings/seo', seo); toast.success('SEO updated!'); showSuccess(); }
    catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfile({ ...profile, avatar: reader.result });
    reader.readAsDataURL(file);
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: <FiUser size={18} />, desc: 'Manage your personal information' },
    { id: 'security', label: 'Security', icon: <FiShield size={18} />, desc: 'Password & authentication' },
    { id: 'social', label: 'Social Links', icon: <FiLink size={18} />, desc: 'Connect your social media' },
    { id: 'seo', label: 'SEO & Meta', icon: <FiGlobe size={18} />, desc: 'Search engine optimization' },
    { id: 'notifications', label: 'Notifications', icon: <FiBell size={18} />, desc: 'Alert preferences' },
    { id: 'system', label: 'System', icon: <FiServer size={18} />, desc: 'Server & database info' },
  ];

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse"></div>
        <div className="flex gap-8">
          <div className="w-64 space-y-3">
            {[...Array(6)].map((_, i) => (<div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse"></div>))}
          </div>
          <div className="flex-1 h-96 bg-white/5 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Animation Overlay */}
      <AnimatePresence>
        {successAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <FiCheck size={24} /> Changes saved successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <FiZap className="text-primary-400" /> Settings
        </h1>
        <p className="text-gray-400 mt-1">Manage your portfolio configuration</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 space-y-1">
          {sections.map(section => (
            <motion.button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              whileHover={{ x: 4 }}
              className={`w-full text-left p-4 rounded-2xl transition-all duration-200 ${
                activeSection === section.id
                  ? 'bg-primary-600/20 border border-primary-500/30 shadow-lg shadow-primary-500/10'
                  : 'border border-transparent hover:bg-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={activeSection === section.id ? 'text-primary-400' : 'text-gray-400'}>
                  {section.icon}
                </span>
                <div>
                  <p className={`font-medium text-sm ${activeSection === section.id ? 'text-white' : 'text-gray-300'}`}>
                    {section.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{section.desc}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* PROFILE SECTION */}
          {activeSection === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-dark-800 border border-white/10 rounded-3xl overflow-hidden">
              <div className="p-8">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><FiUser className="text-primary-400" /> Profile Information</h2>
                <p className="text-gray-400 text-sm mb-8">Update your personal details and public profile</p>

                {/* Avatar Section */}
                <div className="flex items-center gap-8 mb-10 p-6 bg-dark-900/50 rounded-2xl border border-white/5">
                  <div className="relative group">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Avatar" className="w-28 h-28 rounded-2xl object-cover border-2 border-primary-500/30 shadow-xl" />
                    ) : (
                      <div className="w-28 h-28 bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl flex items-center justify-center text-4xl font-bold shadow-xl">
                        {profile.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div {...getAvatarRootProps()}
                      className="absolute -bottom-3 -right-3 w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center cursor-pointer hover:bg-primary-500 transition-colors shadow-lg opacity-0 group-hover:opacity-100">
                      <input {...getAvatarInputProps()} />
                      <FiCamera size={16} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{profile.name || 'Your Name'}</h3>
                    <p className="text-gray-400 text-sm mb-3">{profile.title || 'Your Title'}</p>
                    <div className="flex gap-2">
                      <label className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl cursor-pointer text-sm transition-colors flex items-center gap-2">
                        <FiUpload size={14} /> Change Photo
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                      {profile.avatar && (
                        <button onClick={() => setProfile({ ...profile, avatar: null })}
                          className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm transition-colors flex items-center gap-2">
                          <FiTrash2 size={14} /> Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                    <input type="text" value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl focus:border-primary-500 outline-none text-white transition-colors"
                      placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
                    <input type="text" value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl focus:border-primary-500 outline-none text-white transition-colors"
                      placeholder="Software Engineer" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2"><FiMail className="inline mr-1" size={14} /> Email</label>
                    <input type="email" value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl focus:border-primary-500 outline-none text-white transition-colors"
                      placeholder="email@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2"><FiPhone className="inline mr-1" size={14} /> Phone</label>
                    <input type="text" value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl focus:border-primary-500 outline-none text-white transition-colors"
                      placeholder="+84 123 456 789" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2"><FiMapPin className="inline mr-1" size={14} /> Location</label>
                    <input type="text" value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl focus:border-primary-500 outline-none text-white transition-colors"
                      placeholder="City, Country" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2"><FiGlobe className="inline mr-1" size={14} /> Website</label>
                    <input type="url" value={profile.website}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl focus:border-primary-500 outline-none text-white transition-colors"
                      placeholder="https://yourname.dev" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                    <textarea value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl focus:border-primary-500 outline-none text-white transition-colors resize-none"
                      rows="4" placeholder="Tell us about yourself..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2"><FiFileText className="inline mr-1" size={14} /> CV / Resume</label>
                    <div {...getCVRootProps()}
                      className="w-full px-6 py-8 bg-dark-900 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary-500 transition-colors text-center">
                      <input {...getCVInputProps()} />
                      <FiUpload size={24} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-400 text-sm">{profile.cvFile ? profile.cvFile.name : 'Drag & drop your CV here, or click to browse'}</p>
                      <p className="text-gray-500 text-xs mt-1">PDF format, max 5MB</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-8 pt-6 border-t border-white/10">
                  <motion.button onClick={handleSaveProfile} disabled={saving}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="px-8 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50">
                    <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* SECURITY SECTION */}
          {activeSection === 'security' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-dark-800 border border-white/10 rounded-3xl p-8">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><FiShield className="text-primary-400" /> Security</h2>
              <p className="text-gray-400 text-sm mb-8">Manage your password and authentication settings</p>

              <form onSubmit={handleChangePassword} className="max-w-lg space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                  <input type="password" value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl focus:border-primary-500 outline-none text-white" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                  <input type="password" value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl focus:border-primary-500 outline-none text-white" required minLength={8} />
                  {passwords.new && (
                    <div className="mt-3">
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= passwordStrength ? strengthColors[passwordStrength] : 'bg-white/10'}`}></div>
                        ))}
                      </div>
                      <p className={`text-xs ${passwordStrength >= 3 ? 'text-green-400' : 'text-gray-500'}`}>
                        Password strength: {strengthLabels[passwordStrength]} {passwordStrength >= 3 ? '✅' : ''}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                  <input type="password" value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl focus:border-primary-500 outline-none text-white" required />
                  {passwords.confirm && passwords.new !== passwords.confirm && (
                    <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><FiAlertCircle size={12} /> Passwords do not match</p>
                  )}
                </div>
                <motion.button type="submit" disabled={saving}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg disabled:opacity-50">
                  <FiLock size={16} /> {saving ? 'Updating...' : 'Update Password'}
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* SOCIAL LINKS SECTION */}
          {activeSection === 'social' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-dark-800 border border-white/10 rounded-3xl p-8">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><FiLink className="text-primary-400" /> Social Links</h2>
              <p className="text-gray-400 text-sm mb-8">Connect your social media profiles</p>

              <div className="grid md:grid-cols-2 gap-5">
                {[
                  { key: 'github', label: 'GitHub', icon: '🐙', placeholder: 'https://github.com/username' },
                  { key: 'linkedin', label: 'LinkedIn', icon: '💼', placeholder: 'https://linkedin.com/in/username' },
                  { key: 'twitter', label: 'Twitter', icon: '🐦', placeholder: 'https://twitter.com/username' },
                  { key: 'facebook', label: 'Facebook', icon: '📘', placeholder: 'https://facebook.com/username' },
                  { key: 'instagram', label: 'Instagram', icon: '📸', placeholder: 'https://instagram.com/username' },
                  { key: 'youtube', label: 'YouTube', icon: '▶️', placeholder: 'https://youtube.com/@channel' },
                  { key: 'devto', label: 'Dev.to', icon: '📝', placeholder: 'https://dev.to/username' },
                  { key: 'medium', label: 'Medium', icon: '📄', placeholder: 'https://medium.com/@username' },
                  { key: 'stackoverflow', label: 'Stack Overflow', icon: '🟧', placeholder: 'https://stackoverflow.com/users/id' },
                  { key: 'website', label: 'Website', icon: '🌐', placeholder: 'https://yourname.dev' },
                ].map(item => (
                  <div key={item.key}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <span className="mr-2">{item.icon}</span> {item.label}
                    </label>
                    <input type="url" value={social[item.key] || ''}
                      onChange={(e) => setSocial({ ...social, [item.key]: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl focus:border-primary-500 outline-none text-white transition-colors"
                      placeholder={item.placeholder} />
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-8 pt-6 border-t border-white/10">
                <motion.button onClick={handleSaveSocial} disabled={saving}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg disabled:opacity-50">
                  <FiSave /> {saving ? 'Saving...' : 'Save Links'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* SEO SECTION */}
          {activeSection === 'seo' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-dark-800 border border-white/10 rounded-3xl p-8">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><FiGlobe className="text-primary-400" /> SEO & Meta Tags</h2>
              <p className="text-gray-400 text-sm mb-8">Optimize your portfolio for search engines</p>

              <div className="space-y-5 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Site Title</label>
                  <input type="text" value={seo.siteTitle}
                    onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl focus:border-primary-500 outline-none text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Meta Description</label>
                  <textarea value={seo.metaDescription}
                    onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl focus:border-primary-500 outline-none text-white resize-none" rows="3"
                    maxLength={160} />
                  <p className="text-xs text-gray-500 mt-1">{seo.metaDescription?.length || 0}/160 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Keywords (comma separated)</label>
                  <input type="text" value={seo.keywords}
                    onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl focus:border-primary-500 outline-none text-white"
                    placeholder="developer, portfolio, react" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Google Analytics ID</label>
                  <input type="text" value={seo.googleAnalytics}
                    onChange={(e) => setSeo({ ...seo, googleAnalytics: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl focus:border-primary-500 outline-none text-white"
                    placeholder="G-XXXXXXXXXX" />
                </div>
              </div>

              <div className="flex justify-end mt-8 pt-6 border-t border-white/10">
                <motion.button onClick={handleSaveSEO} disabled={saving}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg disabled:opacity-50">
                  <FiSave /> {saving ? 'Saving...' : 'Save SEO'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* NOTIFICATIONS SECTION */}
          {activeSection === 'notifications' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-dark-800 border border-white/10 rounded-3xl p-8">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><FiBell className="text-primary-400" /> Notification Preferences</h2>
              <p className="text-gray-400 text-sm mb-8">Control how you receive alerts</p>

              <div className="space-y-4 max-w-lg">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email alerts for important updates' },
                  { key: 'pushNotifications', label: 'Push Notifications', desc: 'Get notified in real-time' },
                  { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive weekly analytics summary' },
                  { key: 'newMessageAlert', label: 'New Message Alert', desc: 'Get notified when someone contacts you' },
                  { key: 'commentAlert', label: 'Comment Alert', desc: 'Get notified on new blog comments' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-dark-900/50 rounded-xl border border-white/5">
                    <div>
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                      className={`relative w-12 h-7 rounded-full transition-colors ${notifications[item.key] ? 'bg-primary-600' : 'bg-white/10'}`}>
                      <motion.div
                        animate={{ x: notifications[item.key] ? 20 : 2 }}
                        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SYSTEM SECTION */}
          {activeSection === 'system' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-dark-800 border border-white/10 rounded-3xl p-8">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><FiServer className="text-primary-400" /> System Information</h2>
              <p className="text-gray-400 text-sm mb-8">Server and database status</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {[
                  { label: 'Node.js Version', value: systemInfo.nodeVersion, icon: <FiCpu size={20} />, color: 'text-green-400' },
                  { label: 'Database Size', value: systemInfo.databaseSize, icon: <FiDatabase size={20} />, color: 'text-blue-400' },
                  { label: 'Uptime', value: systemInfo.uptime, icon: <FiActivity size={20} />, color: 'text-purple-400' },
                  { label: 'Last Backup', value: systemInfo.lastBackup, icon: <FiHardDrive size={20} />, color: 'text-yellow-400' },
                  { label: 'CPU Usage', value: systemInfo.cpuUsage, icon: <FiCpu size={20} />, color: 'text-orange-400' },
                  { label: 'Memory', value: systemInfo.memoryUsage, icon: <FiServer size={20} />, color: 'text-cyan-400' },
                ].map((item, i) => (
                  <motion.div key={i} whileHover={{ y: -2 }}
                    className="bg-dark-900/50 border border-white/5 rounded-2xl p-5 text-center">
                    <div className={`mb-3 flex justify-center ${item.color}`}>{item.icon}</div>
                    <p className="text-2xl font-bold mb-1">{item.value}</p>
                    <p className="text-xs text-gray-400">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;