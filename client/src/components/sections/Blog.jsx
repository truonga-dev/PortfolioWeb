import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiClock, FiArrowRight, FiX, FiHeart, FiMessageCircle, FiSend, FiUser, FiTag, FiShare2, FiBookmark, FiEye, FiLink, FiCopy } from 'react-icons/fi';
import { FaFacebook, FaXTwitter } from 'react-icons/fa6';
import { SiZalo } from 'react-icons/si';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';

const Blog = () => {
  const { t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [commentName, setCommentName] = useState('');
  const [likedPosts, setLikedPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/blog')
      .then(({ data }) => setPosts(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLike = async (postId) => {
    if (likedPosts.includes(postId)) return;
    try {
      await axios.post(`http://localhost:5000/api/blog/${postId}/like`);
      setPosts(prev => prev.map(p => p._id === postId ? {...p, likes: (p.likes||0)+1} : p));
      if (selectedPost?._id === postId) setSelectedPost(prev => ({...prev, likes: (prev.likes||0)+1}));
      setLikedPosts([...likedPosts, postId]);
    } catch (err) {}
  };

  const handleComment = async (postId) => {
    if (!comment.trim() || !commentName.trim()) return toast.error('Please enter your name and comment');
    try {
      const { data } = await axios.post(`http://localhost:5000/api/blog/${postId}/comment`, { user: commentName, content: comment });
      setPosts(prev => prev.map(p => p._id === postId ? {...p, comments: [...(p.comments||[]), data.data]} : p));
      if (selectedPost?._id === postId) setSelectedPost(prev => ({...prev, comments: [...(prev.comments||[]), data.data]}));
      setComment('');
    } catch (err) { toast.error('Failed to add comment'); }
  };

  const handleShareFacebook = (post) => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin+'/blog/'+post.slug)}`, '_blank', 'width=600,height=400'); };
  const handleShareTwitter = (post) => { window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin+'/blog/'+post.slug)}&text=${encodeURIComponent(post.title)}`, '_blank', 'width=600,height=400'); };
  const handleShareZalo = (post) => { window.open(`https://zalo.me/share?u=${encodeURIComponent(window.location.origin+'/blog/'+post.slug)}`, '_blank', 'width=600,height=400'); };
  const handleCopyLink = (post) => { navigator.clipboard.writeText(window.location.origin+'/blog/'+post.slug); setCopied(true); toast.success(t('copy_link')+'! 📋'); setTimeout(() => setCopied(false), 2000); setShowShareMenu(false); };

  const categories = ['all', 'tutorial', 'experience', 'technology', 'career'];
  const filteredPosts = activeCategory === 'all' ? posts : posts.filter(p => p.category === activeCategory);

  if (loading) return (
    <section id="blog" className="py-20 bg-dark-900/50"><div className="max-w-7xl mx-auto px-4"><div className="text-center mb-16"><div className="h-10 w-64 bg-white/5 rounded-lg mx-auto animate-pulse mb-4"></div></div><div className="grid md:grid-cols-3 gap-8">{[...Array(3)].map((_,i)=>(<div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-pulse"><div className="h-48 bg-white/5"></div><div className="p-6 space-y-3"><div className="h-4 w-24 bg-white/5 rounded"></div><div className="h-6 w-full bg-white/5 rounded"></div></div></div>))}</div></div></section>
  );

  return (
    <section id="blog" className="py-20 bg-dark-900/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-primary-400 font-mono text-sm tracking-wider uppercase">{t('blog')}</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">{t('latest_articles')}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">{t('blog_desc')}</p>
        </motion.div>

        <div className="flex justify-center flex-wrap gap-3 mb-12">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-primary-600 text-white scale-105' : 'bg-dark-800 text-gray-400 border border-white/10'}`}>
              {cat === 'all' ? t('all') : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {!selectedPost && (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, i) => (
              <motion.article key={post._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedPost(post)} className="group cursor-pointer">
                <div className="bg-dark-800/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-primary-500/50 transition-all duration-500 hover:-translate-y-2">
                  <div className="relative h-52 overflow-hidden">
                    {post.coverImage ? <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      : <div className="w-full h-full bg-gradient-to-br from-primary-600/20 to-purple-600/20 flex items-center justify-center"><FiBookmark size={48} className="text-primary-400/50" /></div>}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent"></div>
                    <div className="absolute top-4 left-4"><span className="px-3 py-1.5 bg-dark-900/80 text-primary-400 rounded-full text-xs">{post.category}</span></div>
                    <div className="absolute top-4 right-4"><span className="px-3 py-1.5 bg-dark-900/80 text-gray-300 rounded-full text-xs flex items-center gap-1"><FiClock size={12} /> {post.readingTime || 5} min</span></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span><FiCalendar size={12} className="inline mr-1" />{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                      <span><FiEye size={12} className="inline mr-1" />{post.views || 0}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary-400">{post.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span><FiHeart size={14} className={likedPosts.includes(post._id) ? 'text-red-400 fill-red-400' : ''} />{post.likes||0}</span>
                        <span><FiMessageCircle size={14} />{post.comments?.length||0}</span>
                      </div>
                      <span className="text-primary-400 text-sm font-medium flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">{t('read_more')} <FiArrowRight size={14} /></span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        <AnimatePresence>
          {selectedPost && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
              onClick={() => { setSelectedPost(null); setShowShareMenu(false); }}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                className="bg-dark-800 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={e => e.stopPropagation()}>
                {selectedPost.coverImage && (
                  <div className="relative h-72 overflow-hidden rounded-t-3xl">
                    <img src={selectedPost.coverImage} alt={selectedPost.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-800 via-dark-800/50 to-transparent"></div>
                    <div className="absolute bottom-6 left-6"><span className="px-3 py-1.5 bg-primary-600/80 text-white rounded-full text-xs">{selectedPost.category}</span></div>
                  </div>
                )}
                <div className="p-6 md:p-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span><FiCalendar size={14} className="inline mr-1" />{new Date(selectedPost.publishedAt).toLocaleDateString()}</span>
                      <span><FiClock size={14} className="inline mr-1" />{selectedPost.readingTime||5} {t('min_read')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <button onClick={() => setShowShareMenu(!showShareMenu)} className="p-2 hover:bg-white/10 rounded-lg"><FiShare2 size={18} /></button>
                        <AnimatePresence>
                          {showShareMenu && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                              className="absolute right-0 top-12 bg-dark-800 border border-white/10 rounded-2xl p-3 shadow-2xl z-50 w-48">
                              <button onClick={()=>{handleShareFacebook(selectedPost);setShowShareMenu(false)}} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-xl"><FaFacebook className="text-blue-500" size={18} />Facebook</button>
                              <button onClick={()=>{handleShareTwitter(selectedPost);setShowShareMenu(false)}} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-xl"><FaXTwitter className="text-white" size={18} />X (Twitter)</button>
                              <button onClick={()=>{handleShareZalo(selectedPost);setShowShareMenu(false)}} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-xl"><SiZalo className="text-blue-400" size={18} />Zalo</button>
                              <div className="border-t border-white/10 my-1"></div>
                              <button onClick={()=>handleCopyLink(selectedPost)} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-xl">
                                {copied ? <FiCopy size={18} className="text-green-400" /> : <FiLink size={18} />}{copied ? 'Copied!' : t('copy_link')}
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <button onClick={() => { setSelectedPost(null); setShowShareMenu(false); }} className="p-2 hover:bg-white/10 rounded-lg"><FiX size={20} /></button>
                    </div>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-6">{selectedPost.title}</h1>
                  <div className="blog-content text-gray-300 leading-relaxed space-y-4 mb-10" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
                  
                  <div className="flex items-center gap-6 py-6 border-t border-b border-white/10 mb-8">
                    <button onClick={() => handleLike(selectedPost._id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl ${likedPosts.includes(selectedPost._id) ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-gray-400'}`}>
                      <FiHeart size={18} className={likedPosts.includes(selectedPost._id) ? 'fill-current' : ''} /> {selectedPost.likes||0} {t('likes')}
                    </button>
                    <span className="flex items-center gap-2 text-gray-400"><FiMessageCircle size={18} /> {selectedPost.comments?.length||0} {t('comments')}</span>
                  </div>

                  <div className="space-y-4 mb-8">
                    <h3 className="text-lg font-bold"><FiMessageCircle className="text-primary-400 inline mr-2" />{t('comments')} ({selectedPost.comments?.length||0})</h3>
                    {selectedPost.comments?.map((c,i) => (
                      <div key={i} className="bg-dark-900/50 border border-white/5 rounded-2xl p-4">
                        <div className="flex items-center gap-3 mb-2"><div className="w-9 h-9 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 font-bold">{c.user?.charAt(0)?.toUpperCase()}</div><p className="font-semibold text-primary-400">{c.user}</p></div>
                        <p className="text-gray-300 text-sm">{c.content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-dark-900/50 border border-white/5 rounded-2xl p-5">
                    <h4 className="font-bold mb-3"><FiUser className="text-primary-400 inline mr-2" />{t('leave_comment')}</h4>
                    <input value={commentName} onChange={e => setCommentName(e.target.value)} placeholder={t('your_name')}
                      className="w-full px-4 py-2.5 bg-dark-800 border border-white/10 rounded-xl text-white mb-3 text-sm" />
                    <div className="flex gap-2">
                      <input value={comment} onChange={e => setComment(e.target.value)} placeholder={t('write_comment')}
                        className="flex-1 px-4 py-2.5 bg-dark-800 border border-white/10 rounded-xl text-white text-sm" />
                      <button onClick={() => handleComment(selectedPost._id)} className="px-5 py-2.5 bg-primary-600 rounded-xl"><FiSend size={14} /></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Blog;