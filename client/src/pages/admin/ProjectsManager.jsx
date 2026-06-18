import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiEye, FiStar } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import ExportButton from '../../components/admin/ExportButton';

const API = axios.create({ baseURL: 'https://portfoliowebapi.onrender.com/api' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ITEMS_PER_PAGE = 6;

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [form, setForm] = useState({
    title: '', description: '', longDescription: '', technologies: '',
    category: 'web', status: 'completed', featured: false,
    githubUrl: '', liveUrl: '', challenges: '', learnings: ''
  });

  const loadProjects = useCallback(async () => {
    try {
      const { data } = await API.get('/projects');
      setProjects(data.data || []);
    } catch (err) { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  useEffect(() => {
    let result = [...projects];
    if (filter !== 'all') result = result.filter(p => p.category === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q) || p.technologies?.some(t => t.toLowerCase().includes(q)));
    }
    setFilteredProjects(result); setCurrentPage(1);
  }, [projects, filter, search]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setForm({
        title: project.title || '', description: project.description || '', longDescription: project.longDescription || '',
        technologies: project.technologies?.join(', ') || '', category: project.category || 'web',
        status: project.status || 'completed', featured: project.featured || false,
        githubUrl: project.githubUrl || '', liveUrl: project.liveUrl || '',
        challenges: project.challenges?.join(', ') || '', learnings: project.learnings?.join(', ') || ''
      });
    } else {
      setEditingProject(null);
      setForm({ title: '', description: '', longDescription: '', technologies: '', category: 'web', status: 'completed', featured: false, githubUrl: '', liveUrl: '', challenges: '', learnings: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean), challenges: form.challenges.split(',').map(t => t.trim()).filter(Boolean), learnings: form.learnings.split(',').map(t => t.trim()).filter(Boolean) };
      if (editingProject) { await API.put(`/projects/${editingProject._id}`, payload); toast.success('Project updated!'); }
      else { await API.post('/projects', payload); toast.success('Project created!'); }
      setShowModal(false); loadProjects();
    } catch (err) { toast.error('Failed to save project'); }
  };

  const handleDelete = async (id) => { if (!confirm('Delete?')) return; try { await API.delete(`/projects/${id}`); toast.success('Deleted!'); loadProjects(); } catch (err) { toast.error('Failed'); } };
  const toggleFeatured = async (project) => { try { await API.put(`/projects/${project._id}`, { featured: !project.featured }); toast.success('Updated!'); loadProjects(); } catch (err) { toast.error('Failed'); } };

  const categories = ['all', 'web', 'mobile', 'ai-ml', 'devops'];
  const statusColors = { 'completed': 'bg-green-500/20 text-green-400', 'in-progress': 'bg-yellow-500/20 text-yellow-400', 'maintenance': 'bg-blue-500/20 text-blue-400', 'archived': 'bg-gray-500/20 text-gray-400' };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div><h1 className="text-2xl font-bold">📁 Projects</h1><p className="text-gray-400 text-sm mt-1">{filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} total</p></div>
        <div className="flex items-center gap-3">
          <ExportButton data={projects} filename="projects" />
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => openModal()} className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-xl font-semibold flex items-center gap-2"><FiPlus /> Add Project</motion.button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative"><FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white" /></div>
        <div className="flex gap-2 flex-wrap">{categories.map(cat => (<button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-xl text-sm font-medium ${filter === cat ? 'bg-primary-600 text-white' : 'bg-dark-800 text-gray-400 border border-white/10'}`}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</button>))}</div>
      </div>
      {loading ? (<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => (<div key={i} className="bg-dark-800 border border-white/10 rounded-2xl h-64 animate-pulse" />))}</div>) : paginatedProjects.length === 0 ? (<div className="text-center py-20"><p className="text-gray-400">No projects found</p></div>) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProjects.map((project) => (
              <motion.div key={project._id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-dark-800 border border-white/10 rounded-2xl overflow-hidden hover:border-primary-500/50 transition-all group">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>{project.status}</span>
                    <button onClick={() => toggleFeatured(project)} className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 ${project.featured ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-gray-400'}`}><FiStar size={16} fill={project.featured ? 'currentColor' : 'none'} /></button>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">{project.technologies?.slice(0, 4).map(tech => (<span key={tech} className="px-2 py-1 text-xs rounded-lg bg-primary-500/10 text-primary-400">{tech}</span>))}</div>
                  <div className="flex gap-2 pt-4 border-t border-white/10">
                    <button onClick={() => openModal(project)} className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm flex items-center gap-1"><FiEdit2 size={14} /> Edit</button>
                    <button onClick={() => handleDelete(project._id)} className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm"><FiTrash2 size={14} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {totalPages > 1 && (<div className="flex justify-center items-center gap-2 mt-8"><button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 bg-dark-800 border border-white/10 rounded-lg disabled:opacity-50">Previous</button>{[...Array(totalPages)].map((_, i) => (<button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-lg text-sm font-medium ${currentPage === i + 1 ? 'bg-primary-600 text-white' : 'bg-dark-800 border border-white/10'}`}>{i + 1}</button>))}<button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 bg-dark-800 border border-white/10 rounded-lg disabled:opacity-50">Next</button></div>)}
        </>
      )}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-dark-800 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-white/10 flex justify-between"><h2 className="text-xl font-bold">{editingProject ? '✏️ Edit' : '➕ Add'} Project</h2><button onClick={() => setShowModal(false)}><FiX size={24} /></button></div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Title *" className="w-full px-4 py-2 bg-dark-900 border border-white/10 rounded-lg text-white" required />
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description *" className="w-full px-4 py-2 bg-dark-900 border border-white/10 rounded-lg text-white" rows="3" required />
                <input type="text" value={form.technologies} onChange={e => setForm({...form, technologies: e.target.value})} placeholder="React, Node.js, MongoDB" className="w-full px-4 py-2 bg-dark-900 border border-white/10 rounded-lg text-white" />
                <div className="grid grid-cols-2 gap-4">
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"><option value="web">Web</option><option value="mobile">Mobile</option><option value="ai-ml">AI/ML</option><option value="devops">DevOps</option></select>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-4 py-2 bg-dark-900 border border-white/10 rounded-lg text-white"><option value="completed">Completed</option><option value="in-progress">In Progress</option></select>
                  <input type="url" value={form.githubUrl} onChange={e => setForm({...form, githubUrl: e.target.value})} placeholder="GitHub URL" className="w-full px-4 py-2 bg-dark-900 border border-white/10 rounded-lg text-white" />
                  <input type="url" value={form.liveUrl} onChange={e => setForm({...form, liveUrl: e.target.value})} placeholder="Live URL" className="w-full px-4 py-2 bg-dark-900 border border-white/10 rounded-lg text-white" />
                </div>
                <div className="flex justify-end gap-4"><button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border border-white/10 rounded-lg">Cancel</button><button type="submit" className="px-6 py-2 bg-primary-600 rounded-lg font-semibold">{editingProject ? 'Update' : 'Create'}</button></div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsManager;