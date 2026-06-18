import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: t('home'), href: '#home' },
    { name: t('about'), href: '#about' },
    { name: t('projects'), href: '#projects' },
    { name: t('skills'), href: '#skills' },
    { name: t('blog'), href: '#blog' },
    { name: 'Lab', href: '#lab' },
    { name: t('contact'), href: '#contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark-950/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.a href="#home" className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-purple-600 bg-clip-text text-transparent" whileHover={{ scale: 1.05 }}>
            {'<T7A105 />'}
          </motion.a>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <motion.a key={item.name} href={item.href} className="text-gray-300 hover:text-white transition-colors relative group text-sm font-medium" whileHover={{ y: -2 }}>
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full" />
              </motion.a>
            ))}
            
            {/* Language Toggle */}
            <motion.button onClick={toggleLang} className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold" whileHover={{ scale: 1.1 }}>
              {lang === 'en' ? '🇻🇳' : '🇺🇸'}
            </motion.button>

            {/* Theme Toggle */}
            <motion.button onClick={toggleTheme} className="p-2 rounded-lg bg-white/10 hover:bg-white/20" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              {theme === 'dark' ? <FiSun size={18} className="text-yellow-400" /> : <FiMoon size={18} className="text-gray-600" />}
            </motion.button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleLang} className="px-2 py-1 rounded-lg bg-white/10 text-xs font-bold">
              {lang === 'en' ? '🇻🇳' : '🇺🇸'}
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-lg bg-white/10">
              {theme === 'dark' ? <FiSun size={18} className="text-yellow-400" /> : <FiMoon size={18} className="text-gray-600" />}
            </button>
            <button className="p-2 text-white" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-900/95 backdrop-blur-xl border-b border-white/10">
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <motion.a key={item.name} href={item.href} className="block text-gray-300 hover:text-white py-2" onClick={() => setIsOpen(false)} whileTap={{ scale: 0.95 }}>
                  {item.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;