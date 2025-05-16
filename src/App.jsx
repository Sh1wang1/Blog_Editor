import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BlogEditor from './components/BlogEditor';
import BlogList from './components/BlogList';
import ViewBlog from './components/ViewBlog';
import { BlogProvider } from './context/BlogContext';

function App() {
  return (
    <BlogProvider>
      <Router>
        <div className="app">
          <Navbar />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<BlogList />} />
              <Route path="/editor" element={<BlogEditor />} />
              <Route path="/editor/:id" element={<BlogEditor />} />
              <Route path="/blog/:id" element={<ViewBlog />} />
            </Routes>
          </div>
        </div>
      </Router>
    </BlogProvider>
  );
}

export default App;