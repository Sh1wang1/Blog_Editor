import { useEffect, useState } from "react";
import { getAllBlogs } from "../services/BlogService";

export default function BlogList({ onEdit }) {
  const [drafts, setDrafts] = useState([]);
  const [published, setPublished] = useState([]);

  useEffect(() => {
    (async () => {
      const allBlogs = await getAllBlogs();
      setDrafts(allBlogs.filter(b => b.status === "draft"));
      setPublished(allBlogs.filter(b => b.status === "published"));
    })();
  }, []);

  return (
    <div>
      <h2>Published Blogs</h2>
      <ul>
        {published.map(blog => (
          <li key={blog._id} onClick={() => onEdit(blog)}>{blog.title}</li>
        ))}
      </ul>

      <h2>Drafts</h2>
      <ul>
        {drafts.map(blog => (
          <li key={blog._id} onClick={() => onEdit(blog)}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
}
