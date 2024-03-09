import axios from 'axios';
import API_BASE_URL from './root';

const BUREAU_PATH = '/bureau';

export const createBureau = async (bureauData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${BUREAU_PATH}`, bureauData);
    return response.data;
  } catch (error) {
    console.error('Error creating bureau:', error);
    throw error;
  }
};

export const getAllBureaus = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}${BUREAU_PATH}`);
    return response.data;
  } catch (error) {
    console.error('Error getting bureaus:', error);
    throw error;
  }
};

export const getBureauById = async (bureauId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${BUREAU_PATH}/${bureauId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBureauById = async (bureauId, bureauData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}${BUREAU_PATH}/${bureauId}`, bureauData);
    return response.data;
  } catch (error) {
    console.error('Error updating bureau by ID:', error);
    throw error;
  }
};

export const deleteBureauById = async (bureauId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}${BUREAU_PATH}/${bureauId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting bureau by ID:', error);
    throw error;
  }
};
