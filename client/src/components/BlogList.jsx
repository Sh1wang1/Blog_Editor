import React from 'react';
import { Link } from 'react-router-dom';
import { useBlogContext } from '../context/BlogContext';
import './BlogList.css';

const BlogList = () => {
  const { blogs, loading, error } = useBlogContext();

  if (loading) {
    return <div className="loading">Loading blogs...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  
  const publishedBlogs = blogs.filter(blog => blog.status === 'published');
  const draftBlogs = blogs.filter(blog => blog.status === 'draft');
  
  return (
    <div className="blog-list">
      <div className="published-blogs">
        <h2>Published Blogs</h2>
          {publishedBlogs.length === 0 ? (
          <p>No published blogs yet.</p>
        ) : (
          publishedBlogs.map(blog => (
            <div key={blog.id} className="blog-item">
              <h3>{blog.title}</h3>
              <p className="blog-meta">
                Last updated: {new Date(blog.updatedAt).toLocaleDateString()}
              </p>
              <div className="blog-actions">
                <Link to={`/edit/${blog.id}`} className="btn btn-primary">
                          Edit
                        </Link>
                      </div>
                    </div>
          ))
        )}
            </div>
      
      <div className="draft-blogs">
        <h2>Drafts</h2>
          {draftBlogs.length === 0 ? (
          <p>No drafts yet.</p>
        ) : (
          draftBlogs.map(blog => (
            <div key={blog.id} className="blog-item">
              <h3>{blog.title || 'Untitled Draft'}</h3>
              <p className="blog-meta">
                Last saved: {new Date(blog.updatedAt).toLocaleDateString()}
              </p>
              <div className="blog-actions">
                <Link to={`/edit/${blog.id}`} className="btn btn-primary">
                  Continue Editing
                </Link>
                      </div>
                          </div>
          ))
                        )}
                      </div>
    </div>
  );
};

export default BlogList;
