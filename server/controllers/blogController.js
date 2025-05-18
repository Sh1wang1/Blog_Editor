const Blog = require("../models/Blog");

exports.saveDraft = async (req, res) => {
  try {
    const { id, title, content, tags } = req.body;
    const parsedTags = tags ? tags.split(",").map(tag => tag.trim()) : [];

    if (id) {
      const updated = await Blog.findByIdAndUpdate(
        id,
        { title, content, tags: parsedTags, status: "draft", updated_at: new Date() },
        { new: true }
      );
      return res.status(200).json(updated);
    }

    const newDraft = new Blog({ title, content, tags: parsedTags, status: "draft" });
    await newDraft.save();
    res.status(201).json(newDraft);
  } catch (error) {
    res.status(500).json({ error: "Failed to save draft." });
  }
};

exports.publishBlog = async (req, res) => {
  try {
    const { id, title, content, tags } = req.body;
    const parsedTags = tags ? tags.split(",").map(tag => tag.trim()) : [];

    if (id) {
      const updated = await Blog.findByIdAndUpdate(
        id,
        { title, content, tags: parsedTags, status: "published", updated_at: new Date() },
        { new: true }
      );
      return res.status(200).json(updated);
    }

    const newBlog = new Blog({ title, content, tags: parsedTags, status: "published" });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ error: "Failed to publish blog." });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ updated_at: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blogs." });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Not found" });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog." });
  }
};
