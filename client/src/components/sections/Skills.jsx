import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const Skills = () => {
  const { t } = useLanguage();

  const skillCategories = [
    { title: t('frontend'), skills: [
      { name: 'React', level: 90 }, { name: 'TypeScript', level: 85 }, { name: 'Next.js', level: 80 }, { name: 'Tailwind CSS', level: 90 }, { name: 'HTML/CSS', level: 95 }
    ]},
    { title: t('backend'), skills: [
      { name: 'Node.js', level: 85 }, { name: 'Express', level: 80 }, { name: 'Python', level: 70 }, { name: 'GraphQL', level: 65 }, { name: 'REST APIs', level: 90 }
    ]},
    { title: t('database_devops'), skills: [
      { name: 'MongoDB', level: 80 }, { name: 'PostgreSQL', level: 70 }, { name: 'Docker', level: 75 }, { name: 'Git', level: 90 }, { name: 'AWS', level: 55 }
    ]}
  ];

  return (
    <section id="skills" className="py-20 bg-dark-900/50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{t('my_skills')}</h2>
          <p className="text-gray-400">{t('skills_desc')}</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, ci) => (
            <motion.div key={ci} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6 text-primary-400">{category.title}</h3>
              <div className="space-y-4">
                {category.skills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2"><span className="text-sm">{skill.name}</span><span className="text-sm text-gray-400">{skill.level}%</span></div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                        className="h-full bg-gradient-to-r from-primary-500 to-purple-600 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;