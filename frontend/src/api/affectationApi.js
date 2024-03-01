import axios from 'axios';

const BASE_URL = 'https://tunisairproject.azurewebsites.net/affectation';

// Create a new affectation
export const createAffectation = async (affectationData) => {
  try {
    const response = await axios.post(BASE_URL, affectationData);
    return response.data;
  } catch (error) {
    console.error('Error creating affectation:', error.response.data); // Log the detailed error response
    throw error;
  }
};


// Get all affectations
export const getAllAffectations = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error getting affectations:', error);
    throw error;
  }
};

// Get affectation by ID
export const getAffectationById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting affectation by ID:', error);
    throw error;
  }
};

// Update affectation by ID
export const updateAffectationById = async (id, formData) => {
  try {
    // Set headers for FormData
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const response = await axios.put(`${BASE_URL}/${id}`, formData, config);
    return response.data;
  } catch (error) {
    console.error('Error updating affectation:', error);
    throw error;
  }
};


// Delete affectation by ID
export const deleteAffectationById = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting affectation:', error);
    throw error;
  }
};
