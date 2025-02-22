import axios from "axios";

const API_URL = "http://localhost:5000"; // Backend URL

// Fetch all tasks for a specific user
export const getTasks = async (uid) => {
  const response = await axios.get(`${API_URL}/tasks/${uid}`);
  return response.data;
};

// Add a new task (include order if needed)
export const addTask = async (task) => {
  const response = await axios.post(`${API_URL}/tasks`, task);
  return response.data;
};

// Update a task by its id
export const updateTask = async (id, updates) => {
  const response = await axios.put(`${API_URL}/tasks/${id}`, updates);
  return response.data;
};

// Delete a task by its id
export const deleteTask = async (id) => {
  const response = await axios.delete(`${API_URL}/tasks/${id}`);
  return response.data;
};
