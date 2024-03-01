import React, { useState, useEffect } from 'react';
import { createAffectation } from '../../api/affectationApi';
import { getEmployeesWithoutAffectation, getBureausWithoutAffectation } from '../../api/filterApi';

const CreateAffectation = () => {
  const [affectationData, setAffectationData] = useState({
    employee: '',
    bureau: '',
    decision: null, // Changer à null pour représenter aucune image de décision initialement
  });
  const [employeesWithoutAffectation, setEmployeesWithoutAffectation] = useState([]);
  const [bureausWithoutAffectation, setBureausWithoutAffectation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchDataOnMount = async () => {
      try {
        const employeesData = await getEmployeesWithoutAffectation();
        const bureausData = await getBureausWithoutAffectation();

        setEmployeesWithoutAffectation(employeesData);
        setBureausWithoutAffectation(bureausData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataOnMount();
  }, []);

  const handleCreateAffectation = async () => {
    try {
      if (!affectationData.employee || !affectationData.bureau) {
        console.error('L\'employé et le bureau sont requis.');
        return;
      }
  
      const formData = new FormData();
      formData.append('employeeId', affectationData.employee);
      formData.append('bureauId', affectationData.bureau);
      formData.append('decision', affectationData.decision);
  
      const newAffectation = await createAffectation(formData);
  
      if (newAffectation) {
        console.log('Nouvelle affectation :', newAffectation);
        setSuccessMessage('Affectation créée avec succès !');
        setAffectationData({
          employee: '',
          bureau: '',
          decision: null,
        });
      } else {
        console.error('Erreur lors de la création de l\'affectation.');
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'affectation :', error);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'decision') {
      // Gérer l'entrée de l'image séparément
      const file = e.target.files[0];
      setAffectationData((prevData) => ({
        ...prevData,
        decision: file,
      }));
    } else {
      setAffectationData((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.value,
      }));
    }
  };

  return (
    <div className="container mt-5">
      <h2>Créer une affectation</h2>

      {loading && <p>Chargement...</p>}

      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      <form>
        <div className="mb-3">
          <label htmlFor="employee" className="form-label">
            Employé :
          </label>
          <select
            className="form-control"
            id="employee"
            name="employee"
            value={affectationData.employee}
            onChange={handleChange}
          >
            <option value="">Sélectionner un employé</option>
            {employeesWithoutAffectation.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.name} - {employee.matricule}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="bureau" className="form-label">
            Bureau :
          </label>
          <select
            className="form-control"
            id="bureau"
            name="bureau"
            value={affectationData.bureau}
            onChange={handleChange}
          >
            <option value="">Sélectionner un bureau</option>
            {bureausWithoutAffectation.map((bureau) => (
              <option key={bureau._id} value={bureau._id}>
                {bureau.number} - {bureau.level} - {bureau.bloc} - {bureau.space}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="decision" className="form-label">
            Décision :
          </label>
          <input
            type="file"
            className="form-control"
            id="decision"
            name="decision"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleCreateAffectation}>
          Créer une affectation
        </button>
      </form>
    </div>
  );
};

export default CreateAffectation;
