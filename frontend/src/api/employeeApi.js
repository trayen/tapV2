import axios from 'axios';

const BASE_URL = 'http://localhost:5000/employee';

// Create a new employee
export const createEmployee = async (employeeData, authToken) => {
  try {
    const response = await axios.post(BASE_URL, employeeData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

// Get all employees
export const getAllEmployees = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error getting employees:', error);
    throw error;
  }
};

// Get employee by ID
export const getEmployeeById = async (employeeId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting employee by ID:', error);
    throw error;
  }
};

// Update employee by ID
export const updateEmployeeById = async (employeeId, employeeData) => {
  try {
    const response = await axios.put(`${BASE_URL}/${employeeId}`, employeeData);
    return response.data;
  } catch (error) {
    console.error('Error updating employee by ID:', error);
    throw error;
  }
};

// Delete employee by ID
export const deleteEmployeeById = async (employeeId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting employee by ID:', error);
    throw error;
  }
};
