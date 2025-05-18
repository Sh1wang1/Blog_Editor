import { useState } from "react";
import BlogEditor from "./pages/BlogEditor";
import BlogList from "./pages/BlogList";

function App() {
  const [editingBlog, setEditingBlog] = useState(null);

  return (
    <div>
      <h1>📝 Blog Editor</h1>
      <BlogEditor editingBlog={editingBlog} />
      <hr />
      <BlogList onEdit={(blog) => setEditingBlog(blog)} />
    </div>
  );
}

export default App;
