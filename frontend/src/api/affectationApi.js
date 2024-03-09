import axios from 'axios';
import API_BASE_URL from './root';

const AFFECTATION_PATH = '/affectation';

export const createAffectation = async (affectationData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${AFFECTATION_PATH}`, affectationData);
    return response.data;
  } catch (error) {
    console.error('Error creating affectation:', error.response.data); // Log the detailed error response
    throw error;
  }
};

export const getAllAffectations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}${AFFECTATION_PATH}`);
    return response.data;
  } catch (error) {
    console.error('Error getting affectations:', error);
    throw error;
  }
};

export const getAffectationById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${AFFECTATION_PATH}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting affectation by ID:', error);
    throw error;
  }
};

export const updateAffectationById = async (id, formData) => {
  try {
    // Set headers for FormData
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const response = await axios.put(`${API_BASE_URL}${AFFECTATION_PATH}/${id}`, formData, config);
    return response.data;
  } catch (error) {
    console.error('Error updating affectation:', error);
    throw error;
  }
};

export const deleteAffectationById = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}${AFFECTATION_PATH}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting affectation:', error);
    throw error;
  }
};
