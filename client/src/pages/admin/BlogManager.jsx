import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiEye,
  FiCalendar, FiClock, FiImage, FiHeart, FiMessageSquare,
  FiTag, FiBookOpen
} from 'react-icons/fi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import toast from 'react-hot-toast';

const quillContentStyles = `
  .ql-rendered h1 { font-size: 1.75rem; font-weight: 700; margin: 1.5rem 0 0.75rem; line-height: 1.3; color: #f1f5f9; }
  .ql-rendered h2 { font-size: 1.4rem;  font-weight: 700; margin: 1.25rem 0 0.6rem; line-height: 1.3; color: #f1f5f9; }
  .ql-rendered h3 { font-size: 1.15rem; font-weight: 600; margin: 1rem 0 0.5rem;   line-height: 1.3; color: #f1f5f9; }
  .ql-rendered p  { margin: 0 0 1rem; line-height: 1.75; color: #cbd5e1; }
  .ql-rendered ul, .ql-rendered ol { margin: 0.5rem 0 1rem 1.5rem; color: #cbd5e1; }
  .ql-rendered li { margin-bottom: 0.4rem; line-height: 1.7; }
  .ql-rendered strong { color: #f1f5f9; font-weight: 600; }
  .ql-rendered a  { color: #6366f1; text-decoration: underline; }
  .ql-rendered blockquote {
    border-left: 4px solid #6366f1; margin: 1.25rem 0; padding: 0.75rem 1rem;
    background: rgba(99,102,241,0.08); border-radius: 0 8px 8px 0; color: #94a3b8; font-style: italic;
  }
  .ql-rendered pre, .ql-rendered code {
    background: #0f172a; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;
    font-family: 'Fira Code', monospace; font-size: 0.875rem;
  }
  .ql-rendered pre  { padding: 1rem 1.25rem; margin: 1rem 0; overflow-x: auto; line-height: 1.6; color: #e2e8f0; }
  .ql-rendered code { padding: 0.15rem 0.45rem; color: #a5f3fc; }
  .ql-rendered pre code { background: none; border: none; padding: 0; color: inherit; }
  .ql-rendered img  { max-width: 100%; border-radius: 10px; margin: 1rem 0; }
`;

const API = axios.create({ baseURL: 'http://localhost:5000/api' });
API.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ITEMS_PER_PAGE = 6;

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean'],
  ],
};

const categoryColor = {
  tutorial: 'bg-blue-500/20 text-blue-400',
  experience: 'bg-purple-500/20 text-purple-400',
  technology: 'bg-cyan-500/20 text-cyan-400',
  career: 'bg-orange-500/20 text-orange-400',
  other: 'bg-gray-500/20 text-gray-400',
};

// View Modal Component
const ViewModal = ({ blog, onClose }) => {
  if (!blog) return null;
  const hasImageInContent = blog.content?.trim().startsWith('<img');

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <style>{quillContentStyles}</style>
      <motion.div
        initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
        className="bg-dark-800 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {blog.coverImage && !hasImageInContent && (
          <div className="relative h-56 overflow-hidden rounded-t-2xl">
            <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-800/80 to-transparent" />
          </div>
        )}
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start gap-4 mb-3">
            <h2 className="text-xl md:text-2xl font-bold leading-snug">{blog.title}</h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white">
              <FiX size={18} />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-5 pb-5 border-b border-white/10">
            <span className={`px-2.5 py-1 rounded-full font-medium ${categoryColor[blog.category] || categoryColor.other}`}>{blog.category}</span>
            <span className="flex items-center gap-1.5"><FiCalendar size={12} />{blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('vi-VN') : 'Draft'}</span>
            <span className="flex items-center gap-1.5"><FiClock size={12} />{blog.readingTime || 5} min</span>
            <span className="flex items-center gap-1.5"><FiEye size={12} />{blog.views || 0}</span>
            <span className="flex items-center gap-1.5"><FiHeart size={12} />{blog.likes || 0}</span>
            <span className="flex items-center gap-1.5"><FiMessageSquare size={12} />{blog.comments?.length || 0}</span>
          </div>
          <div className="ql-rendered" dangerouslySetInnerHTML={{ __html: blog.content }} />
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-white/10">
              {blog.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-primary-500/15 text-primary-400 rounded-full text-xs font-medium"><FiTag size={10} />#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main Component
const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [viewingBlog, setViewingBlog] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', tags: '',
    category: 'technology', status: 'published', readingTime: 5, coverImage: '',
  });

  const loadBlogs = useCallback(async () => {
    try {
      const { data } = await API.get('/blog/admin/all');
      setBlogs(data.data || []);
    } catch { toast.error('Failed to load blog posts'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadBlogs(); }, [loadBlogs]);

  useEffect(() => {
    let result = [...blogs];
    if (filter !== 'all') {
      if (filter === 'published' || filter === 'draft') result = result.filter(b => b.status === filter);
      else result = result.filter(b => b.category === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(b => b.title?.toLowerCase().includes(q) || b.excerpt?.toLowerCase().includes(q));
    }
    setFilteredBlogs(result);
    setCurrentPage(1);
  }, [blogs, filter, search]);

  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
  const paginatedBlogs = filteredBlogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const openModal = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setForm({
        title: blog.title || '', excerpt: blog.excerpt || '', content: blog.content || '',
        tags: blog.tags?.join(', ') || '', category: blog.category || 'technology',
        status: blog.status || 'published', readingTime: blog.readingTime || 5, coverImage: blog.coverImage || '',
      });
      setImagePreview(blog.coverImage || null);
    } else {
      setEditingBlog(null);
      setForm({ title: '', excerpt: '', content: '', tags: '', category: 'technology', status: 'published', readingTime: 5, coverImage: '' });
      setImagePreview(null);
    }
    setShowModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setImagePreview(reader.result); setForm(prev => ({ ...prev, coverImage: reader.result })); };
    reader.readAsDataURL(file);
  };

  const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.excerpt) { toast.error('Title and excerpt required!'); return; }
    try {
      const payload = { ...form, slug: generateSlug(form.title), tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), publishedAt: form.status === 'published' ? new Date() : null };
      if (editingBlog) { await API.put(`/blog/${editingBlog._id}`, payload); toast.success('Updated!'); }
      else { await API.post('/blog', payload); toast.success('Created!'); }
      setShowModal(false);
      loadBlogs();
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async (id) => { if (!confirm('Delete?')) return; try { await API.delete(`/blog/${id}`); toast.success('Deleted!'); loadBlogs(); } catch { toast.error('Failed'); } };

  const toggleStatus = async (blog) => {
    try { await API.put(`/blog/${blog._id}`, { status: blog.status === 'published' ? 'draft' : 'published' }); toast.success('Updated!'); loadBlogs(); } catch { toast.error('Failed'); }
  };

  const categories = ['all', 'published', 'draft', 'tutorial', 'experience', 'technology', 'career', 'other'];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div><h1 className="text-2xl font-bold flex items-center gap-2"><FiBookOpen className="text-primary-400" /> Blog Posts</h1><p className="text-gray-400 text-sm mt-1">{filteredBlogs.length} posts</p></div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => openModal()} className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 rounded-xl font-semibold flex items-center gap-2 text-sm"><FiPlus /> New Post</motion.button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts..." className="w-full pl-11 pr-4 py-2.5 bg-dark-800 border border-white/10 rounded-xl focus:border-primary-500 outline-none text-white text-sm" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"><FiX size={14} /></button>}
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${filter === cat ? 'bg-primary-600 text-white' : 'bg-dark-800 text-gray-400 border border-white/10'}`}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(4)].map((_, i) => (<div key={i} className="bg-dark-800 border border-white/10 rounded-2xl h-28 animate-pulse" />))}</div>
      ) : paginatedBlogs.length === 0 ? (
        <div className="text-center py-24"><FiBookOpen size={40} className="mx-auto text-gray-600 mb-3" /><p className="text-gray-400">No blog posts found</p></div>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedBlogs.map((blog) => (
              <motion.div key={blog._id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-dark-800 border border-white/10 rounded-2xl p-5 hover:border-primary-500/40 transition-all group">
                <div className="flex gap-4 items-start">
                  {blog.coverImage ? <img src={blog.coverImage} alt={blog.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0 cursor-pointer" onClick={() => setViewingBlog(blog)} /> : <div onClick={() => setViewingBlog(blog)} className="w-20 h-20 rounded-xl bg-dark-900 border border-white/5 flex items-center justify-center flex-shrink-0 cursor-pointer"><FiBookOpen size={22} className="text-gray-600" /></div>}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="text-base font-bold truncate cursor-pointer hover:text-primary-400" onClick={() => setViewingBlog(blog)}>{blog.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${blog.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{blog.status}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2.5 line-clamp-1">{blog.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span><FiCalendar size={11} className="inline mr-1" />{blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('vi-VN') : 'Draft'}</span>
                      <span><FiClock size={11} className="inline mr-1" />{blog.readingTime || 5}m</span>
                      <span><FiEye size={11} className="inline mr-1" />{blog.views || 0}</span>
                      <span><FiHeart size={11} className="inline mr-1" />{blog.likes || 0}</span>
                    </div>
                    <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => setViewingBlog(blog)} className="px-3 py-1.5 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 rounded-lg text-xs"><FiEye size={11} /> View</button>
                      <button onClick={() => openModal(blog)} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs"><FiEdit2 size={11} /> Edit</button>
                      <button onClick={() => toggleStatus(blog)} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs">{blog.status === 'published' ? 'Unpublish' : 'Publish'}</button>
                      <button onClick={() => handleDelete(blog._id)} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs"><FiTrash2 size={11} /> Delete</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-sm disabled:opacity-40">Previous</button>
              {[...Array(totalPages)].map((_, i) => (<button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-9 h-9 rounded-lg text-sm font-medium ${currentPage === i + 1 ? 'bg-primary-600 text-white' : 'bg-dark-800 border border-white/10'}`}>{i + 1}</button>))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-sm disabled:opacity-40">Next</button>
            </div>
          )}
        </>
      )}

      <AnimatePresence>{viewingBlog && <ViewModal blog={viewingBlog} onClose={() => setViewingBlog(null)} />}</AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-dark-800 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-5 border-b border-white/10 flex justify-between sticky top-0 bg-dark-800 z-10"><h2 className="text-lg font-bold">{editingBlog ? '✏️ Edit Post' : '📝 New Post'}</h2><button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><FiX size={20} /></button></div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div onClick={() => fileInputRef.current?.click()} className="w-36 h-24 bg-dark-900 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden">{imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <div className="text-center text-gray-500"><FiImage size={22} /><span className="text-xs">Cover</span></div>}</div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>
                <input type="text" value={form.title} onChange={(e) => setForm(p => ({...p, title: e.target.value}))} placeholder="Title *" className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-lg text-white" required />
                <div className="grid grid-cols-3 gap-4">
                  <select value={form.category} onChange={(e) => setForm(p => ({...p, category: e.target.value}))} className="px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-sm"><option value="tutorial">Tutorial</option><option value="experience">Experience</option><option value="technology">Technology</option><option value="career">Career</option></select>
                  <select value={form.status} onChange={(e) => setForm(p => ({...p, status: e.target.value}))} className="px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-sm"><option value="published">Published</option><option value="draft">Draft</option></select>
                  <input type="number" value={form.readingTime} onChange={(e) => setForm(p => ({...p, readingTime: parseInt(e.target.value)}))} className="px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-sm" />
                </div>
                <input type="text" value={form.tags} onChange={(e) => setForm(p => ({...p, tags: e.target.value}))} placeholder="Tags (comma separated)" className="w-full px-4 py-2 bg-dark-900 border border-white/10 rounded-lg text-sm" />
                <textarea value={form.excerpt} onChange={(e) => setForm(p => ({...p, excerpt: e.target.value}))} placeholder="Excerpt *" rows="3" className="w-full px-4 py-2 bg-dark-900 border border-white/10 rounded-lg text-sm" required />
                <ReactQuill theme="snow" value={form.content} onChange={(c) => setForm(p => ({...p, content: c}))} modules={quillModules} className="bg-dark-900 text-white" style={{ minHeight: '300px' }} />
                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 border border-white/10 rounded-lg text-sm">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg font-semibold text-sm">{editingBlog ? 'Update' : 'Publish'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogManager;