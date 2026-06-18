import { useState, useEffect } from 'react';
import { FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [social, setSocial] = useState({});

  useEffect(() => {
    axios.get('https://portfoliowebapi.onrender.com/api/settings/public')
      .then(({ data }) => { if (data.data?.social) setSocial(data.data.social); })
      .catch(console.error);
  }, []);

  return (
    <footer className="border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-sm">© {currentYear} Truong A. {t('all_rights_reserved') || 'All rights reserved'}.</p>
          <div className="flex items-center gap-6">
            {social.github && <a href={social.github} target="_blank" className="text-gray-400 hover:text-white"><FiGithub size={20} /></a>}
            {social.linkedin && <a href={social.linkedin} target="_blank" className="text-gray-400 hover:text-white"><FiLinkedin size={20} /></a>}
            {social.twitter && <a href={social.twitter} target="_blank" className="text-gray-400 hover:text-white"><FiTwitter size={20} /></a>}
            <a href="mailto:truonga01.dev@gmail.com" className="text-gray-400 hover:text-white"><FiMail size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;