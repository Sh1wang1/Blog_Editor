import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BlogContext } from '../context/BlogContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blogs, saveBlog, publishBlog } = useContext(BlogContext);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
  const [typingTimer, setTypingTimer] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    status: 'draft'
  });

  useEffect(() => {
    if (id) {
      const blogToEdit = blogs.find(blog => blog.id === id);
      if (blogToEdit) {
        setFormData({
          title: blogToEdit.title,
          content: blogToEdit.content,
          tags: blogToEdit.tags.join(', '),
          status: blogToEdit.status
        });
        setLastSaved(new Date(blogToEdit.updatedAt));
      }
    }
  }, [id, blogs]);

  // Setup auto-save timer (every 30 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      if (formData.title || formData.content) {
        handleAutoSave();
      }
    }, 30000);
    
    setAutoSaveTimer(timer);
    
    return () => {
      if (autoSaveTimer) clearInterval(autoSaveTimer);
    };
  }, [formData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear previous typing timer
    if (typingTimer) clearTimeout(typingTimer);
    
    // Start new typing timer for auto-save after 5 seconds of inactivity
    const timer = setTimeout(() => {
      handleAutoSave();
    }, 5000);
    
    setTypingTimer(timer);
  };

  // Handle rich text editor changes
  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
    
    // Clear previous typing timer
    if (typingTimer) clearTimeout(typingTimer);
    
    // Start new typing timer for auto-save after 5 seconds of inactivity
    const timer = setTimeout(() => {
      handleAutoSave();
    }, 5000);
    
    setTypingTimer(timer);
  };

  // Handle auto-save
  const handleAutoSave = async () => {
    if (!formData.title && !formData.content) return;
    
    try {
      setAutoSaveStatus('Saving...');
      
      // Prepare tags as array
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim())
        : [];
      
      const blogData = {
        ...formData,
        tags: tagsArray,
        status: 'draft'
      };
      
      // If editing, include the id
      if (id) {
        blogData.id = id;
      }
      
      const savedId = await saveBlog(blogData);
      setAutoSaveStatus('Saved');
      setLastSaved(new Date());
      
      // Update URL if it's a new blog
      if (!id && savedId) {
        navigate(`/editor/${savedId}`, { replace: true });
      }
      
      // Clear status after 2 seconds
      setTimeout(() => {
        setAutoSaveStatus('');
      }, 2000);
    } catch (error) {
      setAutoSaveStatus('Save failed');
      console.error('Auto-save error:', error);
    }
  };

  // Handle manual save
  const handleSave = async (e) => {
    e.preventDefault();
    await handleAutoSave();
  };

  // Handle publish
  const handlePublish = async () => {
    if (!formData.title || !formData.content) {
      alert('Please add a title and content before publishing');
      return;
    }
    
    try {
      // First save the current state
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim())
        : [];
      
      const blogData = {
        ...formData,
        tags: tagsArray,
        status: 'draft'
      };
      
      // If editing, include the id
      if (id) {
        blogData.id = id;
        await saveBlog(blogData);
        await publishBlog(id);
      } else {
        const savedId = await saveBlog(blogData);
        await publishBlog(savedId);
        navigate(`/editor/${savedId}`, { replace: true });
      }
      
      // Update status in form
      setFormData(prev => ({ ...prev, status: 'published' }));
      
      alert('Blog published successfully!');
    } catch (error) {
      console.error('Publish error:', error);
      alert('Failed to publish blog');
    }
  };

  return (
    <div className="blog-editor">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{id ? 'Edit Blog' : 'New Blog'}</h2>
        <div className="d-flex align-items-center">
          {autoSaveStatus && (
            <span className="text-muted me-3">{autoSaveStatus}</span>
          )}
          {lastSaved && (
            <span className="text-muted me-3">Last saved: {lastSaved.toLocaleTimeString()}</span>
          )}
          <button 
            className="btn btn-outline-primary me-2" 
            onClick={handleSave}
          >
            Save Draft
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handlePublish}
          >
            Publish
          </button>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Blog Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter blog title"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="content" className="form-label">Content</label>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={handleContentChange}
            placeholder="Write your blog content here..."
            className="blog-editor-quill mb-5"
            style={{ height: '300px', marginBottom: '60px' }}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="tags" className="form-label">Tags (comma-separated)</label>
          <input
            type="text"
            className="form-control"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Enter tags (e.g., technology, programming, react)"
          />
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;