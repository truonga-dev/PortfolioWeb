const router = require('express').Router();
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');

// GET all PUBLISHED posts (public) - CÓ CONTENT
router.get('/', async (req, res) => {
  try {
    const posts = await Blog.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .select('-__v');
    res.json({ success: true, count: posts.length, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET all posts for ADMIN (includes drafts)
router.get('/admin/all', auth, async (req, res) => {
  try {
    const posts = await Blog.find({})
      .sort({ createdAt: -1 })
      .select('-__v');
    res.json({ success: true, count: posts.length, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// LIKE a blog post
router.post('/:id/like', async (req, res) => {
  try {
    const post = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    res.json({ success: true, likes: post.likes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ADD comment
router.post('/:id/comment', async (req, res) => {
  try {
    const { user, content } = req.body;
    if (!user || !content)
      return res.status(400).json({ success: false, error: 'User and content required' });

    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

    const newComment = { user, content, date: new Date() };
    post.comments.push(newComment);
    await post.save();

    res.json({ success: true, data: post.comments[post.comments.length - 1] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single post by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const post = await Blog.findOne({ slug: req.params.slug, status: 'published' });
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

    post.views += 1;
    await post.save();

    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create new post (admin)
router.post('/', auth, async (req, res) => {
  try {
    const post = new Blog(req.body);
    await post.save();
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT update post (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE post (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Blog.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;