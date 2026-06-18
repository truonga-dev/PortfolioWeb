import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiGrid, FiList } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

const CATEGORIES = ['all', 'frontend', 'backend', 'database', 'devops', 'tools', 'soft-skills', 'learning'];
const CATEGORY_COLORS = {
  frontend: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  backend: 'bg-green-500/20 text-green-400 border-green-500/30',
  database: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  devops: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  tools: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'soft-skills': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  learning: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

const SkillsManager = () => {
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const [form, setForm] = useState({
    name: '', category: 'frontend', level: 80, icon: '', color: '#6366f1',
    yearsOfExperience: 1, isHighlighted: false
  });

  const loadSkills = useCallback(async () => {
    try {
      const { data } = await API.get('/skills');
      setSkills(data.data || []);
    } catch (err) {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSkills(); }, [loadSkills]);

  useEffect(() => {
    let result = [...skills];
    if (filter !== 'all') result = result.filter(s => s.category === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s => s.name?.toLowerCase().includes(q));
    }
    setFilteredSkills(result);
  }, [skills, filter, search]);

  const openModal = (skill = null) => {
    if (skill) {
      setEditingSkill(skill);
      setForm({
        name: skill.name || '', category: skill.category || 'frontend',
        level: skill.level || 80, icon: skill.icon || '',
        color: skill.color || '#6366f1', yearsOfExperience: skill.yearsOfExperience || 1,
        isHighlighted: skill.isHighlighted || false
      });
    } else {
      setEditingSkill(null);
      setForm({ name: '', category: 'frontend', level: 80, icon: '', color: '#6366f1', yearsOfExperience: 1, isHighlighted: false });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await API.put(`/skills/${editingSkill._id}`, form);
        toast.success('Skill updated!');
      } else {
        await API.post('/skills', form);
        toast.success('Skill created!');
      }
      setShowModal(false);
      loadSkills();
    } catch (err) {
      toast.error('Failed to save skill');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return;
    try {
      await API.delete(`/skills/${id}`);
      toast.success('Skill deleted!');
      loadSkills();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  // Color picker presets
  const colorPresets = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">🎯 Skills</h1>
          <p className="text-gray-400 text-sm mt-1">{filteredSkills.length} skills total</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-dark-800 border border-white/10 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 ${viewMode === 'grid' ? 'bg-primary-600' : 'hover:bg-white/5'}`}
            ><FiGrid size={18} /></button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 ${viewMode === 'list' ? 'bg-primary-600' : 'hover:bg-white/5'}`}
            ><FiList size={18} /></button>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => openModal()}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-xl font-semibold flex items-center gap-2"
          >
            <FiPlus /> Add Skill
          </motion.button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills..." className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-white/10 rounded-xl focus:border-primary-500 outline-none text-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === cat ? 'bg-primary-600 text-white' : 'bg-dark-800 text-gray-400 hover:bg-dark-700 border border-white/10'
              }`}
            >{cat.charAt(0).toUpperCase() + cat.slice(1)}</button>
          ))}
        </div>
      </div>

      {/* Skills Display */}
      {loading ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-3'}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-dark-800 border border-white/10 rounded-2xl p-6 h-32 animate-pulse" />
          ))}
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No skills found</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredSkills.map((skill) => (
              <motion.div
                key={skill._id} layout initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                className="bg-dark-800 border border-white/10 rounded-2xl p-6 hover:border-primary-500/50 transition-all duration-300 group relative"
              >
                {skill.isHighlighted && (
                  <div className="absolute top-3 right-3 text-yellow-400">⭐</div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{skill.icon || '💡'}</span>
                  <div>
                    <h3 className="font-bold text-lg">{skill.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[skill.category] || 'bg-gray-500/20 text-gray-400'}`}>
                      {skill.category}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Level</span>
                    <span className="text-primary-400 font-bold">{skill.level}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{ background: skill.color || '#6366f1' }}
                    />
                  </div>
                </div>

                <p className="text-gray-400 text-xs">{skill.yearsOfExperience} year(s) experience</p>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openModal(skill)} className="flex-1 px-2 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs flex items-center justify-center gap-1">
                    <FiEdit2 size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(skill._id)} className="px-2 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs">
                    <FiTrash2 size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* LIST VIEW */
        <div className="space-y-3">
          {filteredSkills.map((skill) => (
            <motion.div
              key={skill._id} initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-dark-800 border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:border-primary-500/50 transition-all group"
            >
              <span className="text-2xl">{skill.icon || '💡'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold">{skill.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[skill.category]}`}>{skill.category}</span>
                  {skill.isHighlighted && <span className="text-yellow-400 text-xs">⭐</span>}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 max-w-xs h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${skill.level}%` }} transition={{ duration: 0.8 }}
                      className="h-full rounded-full" style={{ background: skill.color || '#6366f1' }} />
                  </div>
                  <span className="text-sm text-primary-400 font-bold w-10 text-right">{skill.level}%</span>
                  <span className="text-xs text-gray-400">{skill.yearsOfExperience}y exp</span>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openModal(skill)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg"><FiEdit2 size={14} /></button>
                <button onClick={() => handleDelete(skill._id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg"><FiTrash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-800 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-dark-800">
                <h2 className="text-xl font-bold">{editingSkill ? '✏️ Edit Skill' : '➕ Add Skill'}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><FiX size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Skill Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-900 border border-white/10 rounded-lg focus:border-primary-500 outline-none" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-2 bg-dark-900 border border-white/10 rounded-lg focus:border-primary-500 outline-none">
                      {CATEGORIES.filter(c => c !== 'all').map(c => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Level ({form.level}%)</label>
                    <input type="range" min="0" max="100" value={form.level}
                      onChange={(e) => setForm({ ...form, level: parseInt(e.target.value) })}
                      className="w-full accent-primary-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Icon (emoji)</label>
                    <input type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}
                      placeholder="⚛️" className="w-full px-4 py-2 bg-dark-900 border border-white/10 rounded-lg focus:border-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Years Experience</label>
                    <input type="number" min="0" max="20" step="0.5" value={form.yearsOfExperience}
                      onChange={(e) => setForm({ ...form, yearsOfExperience: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 bg-dark-900 border border-white/10 rounded-lg focus:border-primary-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <div className="flex gap-2 mb-2">
                    {colorPresets.map(c => (
                      <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${form.color === c ? 'border-white scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-full h-10 bg-dark-900 border border-white/10 rounded-lg cursor-pointer" />
                </div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.isHighlighted} onChange={(e) => setForm({ ...form, isHighlighted: e.target.checked })} className="w-4 h-4" />
                  <span className="text-sm font-medium">Highlight as top skill ⭐</span>
                </label>
                <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border border-white/10 rounded-lg hover:bg-white/5">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg font-semibold">{editingSkill ? 'Update' : 'Create'} Skill</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillsManager;