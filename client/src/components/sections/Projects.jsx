import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchProjects } from '../../utils/api';
import Card3D from '../ui/Card3D';
import { FiExternalLink, FiGithub } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const Projects = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects().then(({ data }) => setProjects(data.data || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const categories = [
    { key: 'all', label: t('all') },
    { key: 'web', label: t('web') },
    { key: 'mobile', label: t('mobile') },
    { key: 'ai-ml', label: t('ai_ml') },
    { key: 'devops', label: t('devops') },
  ];

  const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{t('featured_projects')}</h2>
          <p className="text-gray-400">{t('projects_desc')}</p>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(cat => (
            <motion.button key={cat.key} onClick={() => setFilter(cat.key)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${filter === cat.key ? 'bg-primary-600 text-white' : 'bg-white/5 text-gray-400'}`}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>{cat.label}</motion.button>
          ))}
        </div>
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (<div key={i} className="bg-white/5 border border-white/10 rounded-2xl h-80 animate-pulse" />))}
          </div>
        ) : (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, i) => (
              <motion.div key={project._id} layout initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedProject(project)}>
                <Card3D>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${project.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{project.status}</span>
                      {project.featured && <span className="px-3 py-1 rounded-full text-xs bg-primary-500/20 text-primary-400">Featured</span>}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies?.slice(0, 4).map(tech => (<span key={tech} className="px-2 py-1 text-xs rounded bg-white/5 text-gray-300">{tech}</span>))}
                    </div>
                    <div className="flex gap-4">
                      {project.liveUrl && <a href={project.liveUrl} target="_blank" onClick={e => e.stopPropagation()} className="text-sm text-primary-400"><FiExternalLink className="inline mr-1" />{t('demo')}</a>}
                      {project.githubUrl && <a href={project.githubUrl} target="_blank" onClick={e => e.stopPropagation()} className="text-sm text-gray-400"><FiGithub className="inline mr-1" />{t('code')}</a>}
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </motion.div>
        )}
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setSelectedProject(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-dark-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between mb-6"><h3 className="text-2xl font-bold">{selectedProject.title}</h3><button onClick={() => setSelectedProject(null)} className="text-gray-400">✕</button></div>
              <p className="text-gray-300 mb-6">{selectedProject.longDescription || selectedProject.description}</p>
              <h4 className="font-semibold mb-3">{t('technologies_used')}</h4>
              <div className="flex flex-wrap gap-2 mb-6">{selectedProject.technologies?.map(tech => (<span key={tech} className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-sm">{tech}</span>))}</div>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div><h4 className="font-semibold mb-2">{t('challenges')}</h4><ul className="list-disc list-inside text-gray-400">{selectedProject.challenges?.map((c,i)=>(<li key={i}>{c}</li>))}</ul></div>
                <div><h4 className="font-semibold mb-2">{t('what_i_learned')}</h4><ul className="list-disc list-inside text-gray-400">{selectedProject.learnings?.map((l,i)=>(<li key={i}>{l}</li>))}</ul></div>
              </div>
              <div className="flex gap-4">
                {selectedProject.liveUrl && <a href={selectedProject.liveUrl} target="_blank" className="px-6 py-2 bg-primary-600 rounded-lg">{t('view_live_demo')}</a>}
                {selectedProject.githubUrl && <a href={selectedProject.githubUrl} target="_blank" className="px-6 py-2 border border-white/20 rounded-lg">{t('view_source_code')}</a>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects;