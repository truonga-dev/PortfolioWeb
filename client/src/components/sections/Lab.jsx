import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const Lab = () => {
  const { t } = useLanguage();

  const experiments = [
    { title: t('lab_css_title') || 'CSS Art Generator', icon: '🎨', desc: t('lab_css_desc') || 'Create beautiful CSS art with visual editor' },
    { title: t('lab_pathfinder_title') || 'Pathfinder Visualizer', icon: '🗺️', desc: t('lab_pathfinder_desc') || 'Visualize pathfinding algorithms in action' },
    { title: t('lab_calculator_title') || 'AI Calculator', icon: '🧮', desc: t('lab_calculator_desc') || 'Smart calculator with natural language input' },
    { title: t('lab_markdown_title') || 'Markdown Editor', icon: '📝', desc: t('lab_markdown_desc') || 'Real-time markdown preview editor' },
  ];

  return (
    <section id="lab" className="py-20 bg-dark-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary-400 to-purple-600 bg-clip-text text-transparent">{t('the_lab')}</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">{t('lab_desc')}</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {experiments.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center cursor-pointer group"
              whileHover={{ y: -8, scale: 1.05 }}
            >
              <div className="text-4xl mb-4 group-hover:animate-bounce">{exp.icon}</div>
              <h3 className="font-bold mb-2">{exp.title}</h3>
              <p className="text-gray-400 text-sm">{exp.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Lab;