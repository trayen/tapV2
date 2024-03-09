import API_BASE_URL from './root'; 
const BASE_PATH = '/filter';

const fetchData = async (routeName) => {
  try {
    const response = await fetch(`${API_BASE_URL}${BASE_PATH}/${routeName}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
};

export const getEmployeesWithAffectation = async () => {
  return fetchData('employees/with-affectation');
};

export const getEmployeesWithoutAffectation = async () => {
  return fetchData('employees/without-affectation');
};

export const getBureausWithAffectation = async () => {
  return fetchData('bureaus/with-affectation');
};

export const getBureausWithoutAffectation = async () => {
  return fetchData('bureaus/without-affectation');
};
