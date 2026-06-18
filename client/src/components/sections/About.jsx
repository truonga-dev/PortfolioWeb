import { motion } from 'framer-motion';
import { FiCode, FiServer, FiDatabase, FiCloud } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  const highlights = [
    { icon: <FiCode size={24} />, title: t('frontend'), desc: 'React, Next.js, TypeScript' },
    { icon: <FiServer size={24} />, title: t('backend'), desc: 'Node.js, Express, Python' },
    { icon: <FiDatabase size={24} />, title: t('database'), desc: 'MongoDB, PostgreSQL, Redis' },
    { icon: <FiCloud size={24} />, title: t('devops'), desc: 'Docker, AWS, CI/CD' },
  ];

  return (
    <section id="about" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t('about')} <span className="bg-gradient-to-r from-primary-400 to-purple-600 bg-clip-text text-transparent">{t('about_me').split(' ').pop()}</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">{t('about_desc')}</p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}>
            <h3 className="text-2xl font-bold mb-4">{t('who_i_am')}</h3>
            <p className="text-gray-400 mb-4">{t('who_i_am_desc1')}</p>
            <p className="text-gray-400 mb-4">{t('who_i_am_desc2')}</p>
            <p className="text-gray-400">{t('who_i_am_desc3')}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} className="grid grid-cols-2 gap-4">
            {highlights.map((item, index) => (
              <motion.div key={index} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center" whileHover={{ y: -5 }}>
                <div className="text-primary-400 mb-3 flex justify-center">{item.icon}</div>
                <h4 className="font-bold mb-2">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;