import React, { useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BlogContext } from '../context/BlogContext';

const ViewBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blogs, deleteBlog } = useContext(BlogContext);
  
  const blog = blogs.find(blog => blog.id === id);
  
  if (!blog) {
    return <div className="alert alert-danger">Blog not found</div>;
  }
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      await deleteBlog(id);
      navigate('/');
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <div className="view-blog">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{blog.title}</h2>
        <div>
          <Link to={`/editor/${blog.id}`} className="btn btn-outline-secondary me-2">
            Edit
          </Link>
          <button className="btn btn-outline-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-muted mb-2">
          {blog.status === 'published' ? (
            <span>Published: {formatDate(blog.publishedAt)}</span>
          ) : (
            <span>Draft - Last updated: {formatDate(blog.updatedAt)}</span>
          )}
        </div>
        
        {blog.tags.length > 0 && (
          <div className="mb-3">
            {blog.tags.map(tag => (
              <span key={tag} className="badge bg-secondary me-1">{tag}</span>
            ))}
          </div>
        )}
      </div>
      
      <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }} />
    </div>
  );
};

export default ViewBlog;
