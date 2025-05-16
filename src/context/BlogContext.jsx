import React, { createContext, useState, useEffect } from 'react';

export const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    const storedBlogs = localStorage.getItem('blogs');
    if (storedBlogs) {
      setBlogs(JSON.parse(storedBlogs));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('blogs', JSON.stringify(blogs));
  }, [blogs]);

  const saveBlog = async (blog) => {
    try {
      // If blog has an ID, it's an update
      if (blog.id) {
        const updatedBlogs = blogs.map(b => 
          b.id === blog.id ? { ...blog, updatedAt: new Date().toISOString() } : b
        );
        setBlogs(updatedBlogs);
        return blog.id;
      } else {
        // New blog
        const newBlog = {
          ...blog,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setBlogs([...blogs, newBlog]);
        return newBlog.id;
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      throw error;
    }
  };

  const publishBlog = async (id) => {
    try {
      const updatedBlogs = blogs.map(blog => 
        blog.id === id 
          ? { 
              ...blog, 
              status: 'published',
              publishedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString() 
            } 
          : blog
      );
      setBlogs(updatedBlogs);
    } catch (error) {
      console.error('Error publishing blog:', error);
      throw error;
    }
  };

  const deleteBlog = async (id) => {
    try {
      const updatedBlogs = blogs.filter(blog => blog.id !== id);
      setBlogs(updatedBlogs);
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  };

  return (
    <BlogContext.Provider
      value={{
        blogs,
        loading,
        saveBlog,
        publishBlog,
        deleteBlog
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
