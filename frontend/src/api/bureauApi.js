import axios from 'axios';

const API_URL = 'https://tunisairproject.azurewebsites.net/bureau';

// Create a new bureau
export const createBureau = async (bureauData) => {
  try {
    const response = await axios.post(API_URL, bureauData);
    return response.data;
  } catch (error) {
    console.error('Error creating bureau:', error);
    throw error;
  }
};

// Get all bureaus
export const getAllBureaus = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error getting bureaus:', error);
    throw error;
  }
};

// Get bureau by ID
export const getBureauById = async (bureauId) => {
  try {
    const response = await axios.get(`${API_URL}/${bureauId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update bureau by ID
export const updateBureauById = async (bureauId, bureauData) => {
  try {
    const response = await axios.put(`${API_URL}/${bureauId}`, bureauData);
    return response.data;
  } catch (error) {
    console.error('Error updating bureau by ID:', error);
    throw error;
  }
};

// Delete bureau by ID
export const deleteBureauById = async (bureauId) => {
  try {
    const response = await axios.delete(`${API_URL}/${bureauId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting bureau by ID:', error);
    throw error;
  }
};
