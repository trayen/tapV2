import axios from 'axios';
import API_BASE_URL from './root'; 

const EMPLOYEE_PATH = '/employee';

export const createEmployee = async (employeeData, authToken) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${EMPLOYEE_PATH}`, employeeData, {
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

export const getAllEmployees = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}${EMPLOYEE_PATH}`);
    return response.data;
  } catch (error) {
    console.error('Error getting employees:', error);
    throw error;
  }
};

export const getEmployeeById = async (employeeId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${EMPLOYEE_PATH}/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting employee by ID:', error);
    throw error;
  }
};

export const updateEmployeeById = async (employeeId, employeeData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}${EMPLOYEE_PATH}/${employeeId}`, employeeData);
    return response.data;
  } catch (error) {
    console.error('Error updating employee by ID:', error);
    throw error;
  }
};

export const deleteEmployeeById = async (employeeId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}${EMPLOYEE_PATH}/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting employee by ID:', error);
    throw error;
  }
};
