import React, { useState } from 'react';
import { createBureau } from '../../api/bureauApi';

const CreateBureau = () => {
  const [bureauData, setBureauData] = useState({
    number: '',
    level: '',
    bloc: '',
    space: '',
  });

  const handleCreateBureau = async () => {
    try {
      const newBureau = await createBureau(bureauData);

      if (newBureau) {
        console.log('Nouveau Bureau :', newBureau);
        // Handle success or navigate to another page

        // Réinitialiser les champs après une soumission réussie
        setBureauData({
          number: '',
          level: '',
          bloc: '',
          space: '',
        });
      } else {
        console.error('Erreur lors de la création du bureau.');
        // Handle error
      }
    } catch (error) {
      console.error('Erreur lors de la création du bureau :', error);
      // Handle error
    }
  };

  const handleChange = (e) => {
    setBureauData({
      ...bureauData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mt-5">
      <h2>Créer un Bureau</h2>

      {/* Formulaire de création de bureau */}
      <form>
        <div className="mb-3">
          <label htmlFor="number" className="form-label">
            Numéro :
          </label>
          <input
            type="text"
            className="form-control"
            id="number"
            name="number"
            value={bureauData.number}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="level" className="form-label">
            Niveau :
          </label>
          <input
            type="text"
            className="form-control"
            id="level"
            name="level"
            value={bureauData.level}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="bloc" className="form-label">
            Bloc :
          </label>
          <input
            type="text"
            className="form-control"
            id="bloc"
            name="bloc"
            value={bureauData.bloc}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="space" className="form-label">
            Espace :
          </label>
          <input
            type="text"
            className="form-control"
            id="space"
            name="space"
            value={bureauData.space}
            onChange={handleChange}
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleCreateBureau}>
          Créer le Bureau
        </button>
      </form>
    </div>
  );
};

export default CreateBureau;
