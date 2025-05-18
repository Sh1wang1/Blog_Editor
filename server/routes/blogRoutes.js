const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// Get all blogs
router.get('/blogs', blogController.getAllBlogs);

// Get a single blog
router.get('/blogs/:id', blogController.getBlogById);

// Save or update a draft
router.post('/blogs/save-draft', blogController.saveDraft);
router.post('/blogs/save-draft/:id', blogController.saveDraft);

// Publish a blog
router.post('/blogs/publish', blogController.publishBlog);
router.post('/blogs/publish/:id', blogController.publishBlog);

module.exports = router;
