import axios from 'axios';
import BASE_URL from './root';

const signupPath = '/auth/signup';
const loginPath = '/auth/login';
const logoutPath = '/auth/logout';

export const signup = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}${signupPath}`, formData);
    
    // Check if response has data property
    if (response.data) {
      return response.data;
    } else {
      // If data is undefined, handle the case appropriately
      throw new Error('Signup failed: No data in the response');
    }
  } catch (error) {
    console.error('Error during signup:', error);
    throw error; // Re-throw the error for the calling function to handle
  }
};

// User Login
export const login = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}${loginPath}`, userData);
    
    // Check if response has data property
    if (response.data) {
      return response.data;
    } else {
      // If data is undefined, handle the case appropriately
      throw new Error('Login failed: No data in the response');
    }
  } catch (error) {
    console.error('Error during login:', error);
    throw error; // Re-throw the error for the calling function to handle
  }
};

// User Logout
export const logout = async (token) => {
  try {
    const response = await axios.post(`${BASE_URL}${logoutPath}`, { token });

    // Check if response has data property
    if (response.data) {
      return response.data;
    } else {
      // If data is undefined, handle the case appropriately
      throw new Error('Logout failed: No data in the response');
    }
  } catch (error) {
    console.error('Error during logout:', error);
    throw error; // Re-throw the error for the calling function to handle
  }
};

export default BASE_URL;
