import { useEffect, useState } from "react";
import { saveDraft, publishBlog } from "../services/BlogService";
import useAutoSave from "../hooks/useAutoSave";

export default function BlogEditor({ editingBlog = null, onSaved }) {
  const [form, setForm] = useState({
    id: "",
    title: "",
    content: "",
    tags: "",
  });
  const [errors, setErrors] = useState({});
  const [lastSaved, setLastSaved] = useState(null);

  // Populate form if editing an existing blog
  useEffect(() => {
    if (editingBlog) {
      setForm({
        id: editingBlog._id || editingBlog.id || "",
        title: editingBlog.title || "",
        content: editingBlog.content || "",
        tags: Array.isArray(editingBlog.tags)
          ? editingBlog.tags.join(", ")
          : editingBlog.tags || "",
      });
    }
  }, [editingBlog]);

  // Auto-save drafts debounce hook
  useAutoSave(
    form,
    async () => {
      if (form.title.trim() || form.content.trim()) {
        try {
          await saveDraft(form);
          setLastSaved(new Date().toLocaleTimeString());
          if (onSaved) onSaved();
        } catch (err) {
          console.error("Auto-save failed:", err);
        }
      }
    },
    5000 // 5 seconds debounce
  );

  // Form validation
  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.content.trim()) newErrors.content = "Content is required";
    if (
      form.tags &&
      !/^([\w\s]+,?)*$/.test(form.tags.trim()) // simple comma-separated word check
    )
      newErrors.tags = "Tags must be comma-separated words";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form inputs
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Save draft button
  const handleSaveDraft = async () => {
    try {
      await saveDraft(form);
      setLastSaved(new Date().toLocaleTimeString());
      alert("💾 Draft saved!");
      if (onSaved) onSaved();
    } catch (err) {
      console.error("Save draft error:", err);
      alert("Failed to save draft.");
    }
  };

  // Publish button
  const handlePublish = async () => {
    if (!validate()) return;

    try {
      await publishBlog(form);
      setLastSaved(new Date().toLocaleTimeString());
      alert("🚀 Published successfully!");
      if (onSaved) onSaved();
    } catch (err) {
      console.error("Publish error:", err);
      alert("Failed to publish.");
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: "1rem" }}>
      <h2>📝 Blog Editor</h2>

      <input
        type="text"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      />
      {errors.title && <p style={{ color: "red" }}>{errors.title}</p>}

      <textarea
        name="content"
        placeholder="Write your content..."
        rows={10}
        value={form.content}
        onChange={handleChange}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      />
      {errors.content && <p style={{ color: "red" }}>{errors.content}</p>}

      <input
        type="text"
        name="tags"
        placeholder="Tags (comma-separated)"
        value={form.tags}
        onChange={handleChange}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      />
      {errors.tags && <p style={{ color: "red" }}>{errors.tags}</p>}

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <button onClick={handleSaveDraft}>💾 Save as Draft</button>
        <button onClick={handlePublish}>🚀 Publish</button>
        {lastSaved && (
          <small style={{ marginLeft: "auto", color: "green" }}>
            ✅ Last saved at {lastSaved}
          </small>
        )}
      </div>
    </div>
  );
}
