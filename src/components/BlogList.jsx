import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { BlogContext } from '../context/BlogContext';

const BlogList = () => {
  const { blogs, loading, deleteBlog } = useContext(BlogContext);
  const [activeTab, setActiveTab] = useState('published');
  
  const publishedBlogs = blogs.filter(blog => blog.status === 'published');
  const draftBlogs = blogs.filter(blog => blog.status === 'draft');
  
  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this blog?')) {
      await deleteBlog(id);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }
  
  return (
    <div className="blog-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Blogs</h2>
        <Link to="/editor" className="btn btn-primary">
          New Blog
        </Link>
      </div>
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'published' ? 'active' : ''}`}
            onClick={() => setActiveTab('published')}
          >
            Published ({publishedBlogs.length})
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'drafts' ? 'active' : ''}`}
            onClick={() => setActiveTab('drafts')}
          >
            Drafts ({draftBlogs.length})
          </button>
        </li>
      </ul>
      
      {activeTab === 'published' && (
        <>
          {publishedBlogs.length === 0 ? (
            <div className="alert alert-info">You don't have any published blogs yet.</div>
          ) : (
            <div className="row">
              {publishedBlogs.map(blog => (
                <div key={blog.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{blog.title}</h5>
                      <div className="small text-muted mb-2">
                        Published: {formatDate(blog.publishedAt)}
                      </div>
                      <div className="card-text">
                        {blog.tags.length > 0 && (
                          <div className="mb-2">
                            {blog.tags.map(tag => (
                              <span key={tag} className="badge bg-secondary me-1">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="card-footer bg-transparent d-flex justify-content-between">
                      <Link to={`/blog/${blog.id}`} className="btn btn-sm btn-outline-primary">
                        View
                      </Link>
                      <div>
                        <Link to={`/editor/${blog.id}`} className="btn btn-sm btn-outline-secondary me-2">
                          Edit
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => handleDelete(blog.id, e)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      {activeTab === 'drafts' && (
        <>
          {draftBlogs.length === 0 ? (
            <div className="alert alert-info">You don't have any draft blogs.</div>
          ) : (
            <div className="row">
              {draftBlogs.map(blog => (
                <div key={blog.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 border-warning">
                    <div className="card-body">
                      <h5 className="card-title">
                        {blog.title || '(Untitled)'}
                      </h5>
                      <div className="small text-muted mb-2">
                        Last updated: {formatDate(blog.updatedAt)}
                      </div>
                      <div className="card-text">
                        {blog.tags.length > 0 && (
                          <div className="mb-2">
                            {blog.tags.map(tag => (
                              <span key={tag} className="badge bg-secondary me-1">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="card-footer bg-transparent d-flex justify-content-between">
                      <span className="badge bg-warning text-dark">Draft</span>
                      <div>
                        <Link to={`/editor/${blog.id}`} className="btn btn-sm btn-outline-secondary me-2">
                          Edit
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => handleDelete(blog.id, e)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogList;
