import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BlogEditor from './components/BlogEditor';
import BlogList from './components/BlogList';
import { BlogProvider } from './context/BlogContext';
import './App.css';

function App() {
  return (
    <BlogProvider>
      <Router>
        <div className="app">
          <nav className="navbar">
            <div className="nav-content">
              <Link to="/" className="nav-brand">Blog Editor</Link>
              <div className="nav-links">
                <Link to="/" className="nav-link">All Blogs</Link>
                <Link to="/new" className="nav-link">New Blog</Link>
              </div>
            </div>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<BlogList />} />
              <Route path="/new" element={<BlogEditor />} />
              <Route path="/edit/:id" element={<BlogEditor />} />
            </Routes>
          </main>
        </div>
      </Router>
    </BlogProvider>
  );
}

export default App;