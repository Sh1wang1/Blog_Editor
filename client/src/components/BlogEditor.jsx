import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { useBlogContext } from '../context/BlogContext';
import 'react-quill/dist/quill.snow.css';
import './BlogEditor.css';

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blogs, addBlog, updateBlog } = useBlogContext();
  
  const existingBlog = id ? blogs.find(blog => blog.id === id) : null;

  const [blog, setBlog] = useState({
    title: existingBlog?.title || '',
    content: existingBlog?.content || '',
    tags: existingBlog?.tags || '',
    status: existingBlog?.status || 'draft'
  });

  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!blog.title && !blog.content) return;
    
    setIsSaving(true);
    try {
      if (id) {
        await updateBlog(id, blog);
      } else {
        await addBlog(blog);
      }
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error auto-saving:', error);
    } finally {
      setIsSaving(false);
    }
  }, [blog, id, addBlog, updateBlog]);

  // Auto-save on content change
  useEffect(() => {
    const timer = setTimeout(() => {
      autoSave();
    }, 30000);

    return () => clearTimeout(timer);
  }, [blog, autoSave]);

  // Auto-save when user stops typing
  useEffect(() => {
    const typingTimer = setTimeout(() => {
      if (blog.title || blog.content) {
        autoSave();
      }
    }, 5000);

    return () => clearTimeout(typingTimer);
  }, [blog, autoSave]);

  const handlePublish = async () => {
    try {
      const publishedBlog = { ...blog, status: 'published' };
      if (id) {
        await updateBlog(id, publishedBlog);
      } else {
        await addBlog(publishedBlog);
      }
      navigate('/');
    } catch (error) {
      console.error('Error publishing blog:', error);
    }
  };

  const handleSaveDraft = async () => {
    await autoSave();
  };

  return (
    <div className="blog-editor">
      <div className="editor-header">
        <input
          type="text"
          className="title-input"
          placeholder="Enter blog title..."
          value={blog.title}
          onChange={(e) => setBlog(prev => ({ ...prev, title: e.target.value }))}
        />
        <div className="editor-actions">
          <button 
            className="btn btn-secondary"
            onClick={handleSaveDraft}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save as Draft'}
          </button>
          <button 
            className="btn btn-primary"
            onClick={handlePublish}
            disabled={!blog.title || !blog.content}
          >
            Publish
          </button>
        </div>
      </div>

      <div className="editor-content">
        <ReactQuill
          value={blog.content}
          onChange={(content) => setBlog(prev => ({ ...prev, content }))}
          placeholder="Write your blog content here..."
        />
      </div>

      <div className="editor-footer">
        <input
          type="text"
          className="tags-input"
          placeholder="Enter tags (comma-separated)"
          value={blog.tags}
          onChange={(e) => setBlog(prev => ({ ...prev, tags: e.target.value }))}
        />
        {lastSaved && (
          <span className="last-saved">
            Last saved: {lastSaved.toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default BlogEditor;