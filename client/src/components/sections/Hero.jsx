import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FiMessageCircle, FiPlay } from 'react-icons/fi';
import axios from 'axios';
import ExportPortfolioPDF from '../features/ExportPortfolioPDF';
import { useLanguage } from '../../context/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState({
    name: 'Truong A', title: 'Software Engineer',
    bio: 'I craft exceptional digital experiences with modern technologies.'
  });
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    axios.get('https://portfoliowebapi.onrender.com/api/settings/public')
      .then(({ data }) => { if (data.data?.profile) setProfile(prev => ({ ...prev, ...data.data.profile })); })
      .catch(console.error);
    axios.get('https://portfoliowebapi.onrender.com/api/projects')
      .then(({ data }) => setProjects(data.data || []))
      .catch(console.error);
    axios.get('https://portfoliowebapi.onrender.com/api/skills')
      .then(({ data }) => setSkills(data.data || []))
      .catch(console.error);
  }, []);

  const stats = [
    { label: t('hours_coding'), value: '1,234+', icon: '⏱️' },
    { label: t('projects_done'), value: `${projects.length}+`, icon: '💻' },
    { label: t('coffee_cups'), value: '567+', icon: '☕' },
    { label: t('github_stars'), value: '3.2k+', icon: '⭐' },
  ];

  return (
    <section id="home" className="min-h-screen flex items-center pt-20">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-primary-400 font-mono mb-4 text-lg">{t('hello')}</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold mb-4">{profile.name}</motion.h1>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="text-2xl md:text-3xl text-gray-400 mb-6 h-16">
              <TypeAnimation sequence={[profile.title, 2000, 'Full Stack Developer', 2000]} wrapper="span" speed={50} repeat={Infinity} />
            </motion.div>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
              className="text-gray-400 text-lg mb-8 max-w-xl">{profile.bio}</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
              className="flex flex-wrap gap-4 items-center">
              <ExportPortfolioPDF profile={profile} projects={projects} skills={skills} />
              <motion.a href="#contact" className="px-6 py-3 border border-white/20 hover:border-white/40 rounded-xl font-semibold flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <FiMessageCircle /> {t('contact_me')}</motion.a>
              <motion.a href="#projects" className="px-6 py-3 border border-white/20 hover:border-white/40 rounded-xl font-semibold flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <FiPlay /> {t('view_work')}</motion.a>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {stats.map((stat, i) => (
                <motion.div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center" whileHover={{ y: -5 }}>
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-xl font-bold text-primary-400">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex justify-center items-center">
            <div className="relative">
              <div className="absolute inset-0 w-80 h-80 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 opacity-20 blur-3xl animate-pulse"></div>
              <img src={profile.avatar || "/profile.jpg"} alt={profile.name}
                className="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover border-4 border-primary-500/50 shadow-2xl"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile.name) + "&size=320&background=6366f1&color=fff"; }} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;