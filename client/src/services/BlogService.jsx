import axios from "axios";

const API_URL = "http://localhost:5000/api/blogs";

export const saveDraft = async (blog) => axios.post(`${API_URL}/save-draft`, blog);
export const publishBlog = async (blog) => axios.post(`${API_URL}/publish`, blog);
export const getAllBlogs = async () => (await axios.get(API_URL)).data;
export const getBlogById = async (id) => (await axios.get(`${API_URL}/${id}`)).data;
