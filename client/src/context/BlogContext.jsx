import React, { createContext, useContext, useState, useEffect } from 'react';

// Export the context so it can be used directly if needed
export const BlogContext = createContext();

export const useBlogContext = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlogContext must be used within a BlogProvider');
  }
  return context;
};

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/blogs');
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }
      const data = await response.json();
      setBlogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addBlog = async (blog) => {
    try {
      const endpoint = blog.status === 'published' 
        ? 'http://localhost:5000/api/blogs/publish'
        : 'http://localhost:5000/api/blogs/save-draft';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blog),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add blog');
      }
      
      const newBlog = await response.json();
      setBlogs(prev => [...prev, newBlog]);
      return newBlog;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateBlog = async (id, blog) => {
    try {
      const endpoint = blog.status === 'published'
        ? `http://localhost:5000/api/blogs/publish/${id}`
        : `http://localhost:5000/api/blogs/save-draft/${id}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blog),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update blog');
      }
      
      const updatedBlog = await response.json();
      setBlogs(prev => prev.map(b => b.id === id ? updatedBlog : b));
      return updatedBlog;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    blogs,
    loading,
    error,
    addBlog,
    updateBlog,
    fetchBlogs,
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
};
