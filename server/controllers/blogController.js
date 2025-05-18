const Blog = require('../models/Blog');

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ updatedAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Save or update a draft
exports.saveDraft = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    // If ID is provided, update existing blog
    if (req.params.id) {
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      
      blog.title = title || blog.title;
      blog.content = content || blog.content;
      blog.tags = tags || blog.tags;
      blog.status = 'draft';
      
      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      // Create new blog
      const newBlog = new Blog({
        title,
        content,
        tags,
        status: 'draft'
      });
      
      const savedBlog = await newBlog.save();
      res.status(201).json(savedBlog);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Publish a blog
exports.publishBlog = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    // If ID is provided, update existing blog
    if (req.params.id) {
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      
      blog.title = title || blog.title;
      blog.content = content || blog.content;
      blog.tags = tags || blog.tags;
      blog.status = 'published';
      
      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      // Create new blog
      const newBlog = new Blog({
        title,
        content,
        tags,
        status: 'published'
      });
      
      const savedBlog = await newBlog.save();
      res.status(201).json(savedBlog);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
