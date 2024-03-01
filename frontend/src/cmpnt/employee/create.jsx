import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { createEmployee } from '../../api/employeeApi';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const [employeeData, setEmployeeData] = useState({
    name: '',
    matricule: '',
    emploi: '',
  });

  const handleCreateEmployee = async () => {
    try {
      // Call createEmployee without explicitly checking the token
      const newEmployee = await createEmployee(employeeData);
  
      // Check if the API call was successful
      if (newEmployee) {
        console.log('Nouvel Employé :', newEmployee);
        // Handle success or navigate to another page
  
        // Réinitialiser les champs après une soumission réussie
        setEmployeeData({
          name: '',
          matricule: '',
          emploi: '',
        });
      } else {
        console.error('Erreur lors de la création de l\'employé.');
        // Handle error
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'employé :', error);
      // Handle error
    }
  };
  
  const handleChange = (e) => {
    setEmployeeData({
      ...employeeData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mt-5">
      <h2> Créer l'Employé</h2>

      {/* Formulaire de création d'employé */}
      <form>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Nom :
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={employeeData.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="matricule" className="form-label">
            Matricule :
          </label>
          <input
            type="text"
            className="form-control"
            id="matricule"
            name="matricule"
            value={employeeData.matricule}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="emploi" className="form-label">
            Emploi :
          </label>
          <input
            type="text"
            className="form-control"
            id="emploi"
            name="emploi"
            value={employeeData.emploi}
            onChange={handleChange}
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleCreateEmployee}>
          Créer l'Employé
        </button>
      </form>

      {/* Outlet for nested routes */}
      <Outlet />
    </div>
  );
};

export default Dashboard;
