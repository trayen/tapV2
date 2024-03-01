import React, { useEffect, useState } from 'react';
import { getAllAffectations, deleteAffectationById, updateAffectationById } from '../../api/affectationApi';
import { getBureauById, getAllBureaus } from '../../api/bureauApi';
import { getBureausWithoutAffectation, getEmployeesWithoutAffectation } from '../../api/filterApi';
import { Card, Button, Collapse, Form, Col, Modal } from 'react-bootstrap';

const AffectationList = () => {
  const [affectations, setAffectations] = useState([]);
  const [bureaus, setBureaus] = useState([]);
  const [bureauDetails, setBureauDetails] = useState(null);
  const [openBureau, setOpenBureau] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedAffectation, setSelectedAffectation] = useState(null);
  const [employeesWithoutAffectation, setEmployeesWithoutAffectation] = useState([]);
  const [bureausWithoutAffectation, setBureausWithoutAffectation] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allAffectations = await getAllAffectations();
        setAffectations(allAffectations);
      } catch (error) {
        console.error('Erreur lors de la récupération des affectations :', error);
      }

      try {
        const allBureaus = await getAllBureaus();
        setBureaus(allBureaus);
      } catch (error) {
        console.error('Erreur lors de la récupération des bureaux :', error);
      }

      try {
        const employeesWithoutAffectationData = await getEmployeesWithoutAffectation();
        setEmployeesWithoutAffectation(employeesWithoutAffectationData);
      } catch (error) {
        console.error('Erreur lors de la récupération des employés sans affectation :', error);
      }

      try {
        const bureausWithoutAffectationData = await getBureausWithoutAffectation();
        setBureausWithoutAffectation(bureausWithoutAffectationData);
      } catch (error) {
        console.error('Erreur lors de la récupération des bureaux sans affectation :', error);
      }
    };

    fetchData();
  }, []);

  const toggleBureau = async (affectation) => {
    setOpenBureau((prevOpen) => (prevOpen === affectation._id ? '' : affectation._id));
    if (openBureau !== affectation._id) {
      try {
        const bureauId = affectation.bureau._id;
        const bureau = await getBureauById(bureauId);
        setBureauDetails(bureau);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du bureau :', error);
        setBureauDetails(null);
      }
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
  };

  const handleUpdate = (affectation) => {
    setSelectedAffectation(affectation);
    setShowUpdateModal(true);
  };

  const handleDelete = (affectation) => {
    setSelectedAffectation(affectation);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteAffectationById(selectedAffectation._id);
      setAffectations((prevAffectations) => prevAffectations.filter((a) => a._id !== selectedAffectation._id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'affectation :', error);
    }
  };

  const handleUpdateField = (fieldName, value) => {
    setSelectedAffectation((prevAffectation) => ({
      ...prevAffectation,
      [fieldName]: value,
    }));
  };

  const handleUpdateAffectation = async () => {
    try {
      if (!selectedAffectation) {
        console.error('Aucune affectation sélectionnée.');
        return;
      }
  
      // Vérifiez si selectedAffectation a un employé et un bureau valides
      if (!selectedAffectation.employee || !selectedAffectation.bureau) {
        console.error('Employé ou bureau non valide dans selectedAffectation.');
        return;
      }
  
      const formData = new FormData();
  
      // Importez les anciennes données pour l'employé et le bureau depuis l'affectation sélectionnée
      const oldEmployeeId = selectedAffectation.employee && typeof selectedAffectation.employee === 'object'
        ? selectedAffectation.employee._id
        : selectedAffectation.employee;
  
      const oldBureauId = selectedAffectation.bureau && typeof selectedAffectation.bureau === 'object'
        ? selectedAffectation.bureau._id
        : selectedAffectation.bureau;
  
      // Ajoutez uniquement les champs modifiés ou utilisez les anciennes données si aucune nouvelle donnée n'est sélectionnée
      if (oldEmployeeId) {
        formData.append('employeeId', oldEmployeeId);
      }
  
      if (oldBureauId) {
        formData.append('bureauId', oldBureauId);
      }
  
      if (selectedAffectation.decision) {
        formData.append('decision', selectedAffectation.decision);
      }
  
      console.log('Entrées de la charge utile de mise à jour :', [...formData.entries()]);
  
      await updateAffectationById(selectedAffectation._id, formData);
  
      // Récupérer les dernières données après une mise à jour réussie
      const updatedAffectations = await getAllAffectations();
      setAffectations(updatedAffectations);
  
      // Fermez la fenêtre modale après la mise à jour
      setShowUpdateModal(false);
      window.location.reload();

    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'affectation :', error);
    }
  };
  
  return (
    <div>
      <h2>Liste d'affectation</h2>
      <Form.Group controlId="search">
        <Form.Control type="text" placeholder="Rechercher des affectations..." value={searchTerm} onChange={handleSearch} />
      </Form.Group>
      <br />
      <div className="row">
        {affectations
          .filter(
            (affectation) =>
              affectation.employee.name.toLowerCase().includes(searchTerm) ||
              affectation.employee.matricule.toLowerCase().includes(searchTerm)
          )
          .map((affectation) => (
            <Col key={affectation._id} xs={12} sm={6} md={4} lg={3}>
              <Card className="mb-3" style={{ width: '100%' }}>
                <Card.Img
                  variant="top"
                  src={`http://localhost:5000/assets/${affectation.decision}`}
                  style={{ width: '100%', height: '200px' }}
                />
                <Card.Body>
                  <Card.Title>{affectation.employee.name}</Card.Title>
                  <div className="affectation-info">
                    <strong>Matricule :</strong> {affectation.employee.matricule}
                  </div>
                  <Button
                    onClick={() => toggleBureau(affectation)}
                    aria-controls={`bureau-${affectation._id}`}
                    aria-expanded={openBureau === affectation._id}
                    variant="primary"
                    className="mr-2"
                  >
                   Afficher le bureau
                  </Button>
                  <Collapse in={openBureau === affectation._id}>
                    <div id={`bureau-${affectation._id}`} className="mt-2">
                      {bureauDetails && (
                        <div>
                          <h5>Détails du bureau</h5>
                          <div>
                            <p>
                              <strong>Numéro :</strong> {bureauDetails.number}
                            </p>
                            <p>
                              <strong>Bloc :</strong> {bureauDetails.bloc}
                            </p>
                            <p>
                              <strong>Niveau :</strong> {bureauDetails.level}
                            </p>
                          </div>
                        </div>
                      )}
                      {!bureauDetails && (
                        <div>
                          <p>Aucun détail de bureau pour l'affectation</p>
                        </div>
                      )}
                    </div>
                  </Collapse>
                </Card.Body>
                <Card.Footer>
                  <Button variant="danger" onClick={() => handleDelete(affectation)}>
                    Supprimer
                  </Button>
                  <Button variant="info" className="ml-2" onClick={() => handleUpdate(affectation)}>
                    Mettre à jour
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
      </div>

      {/* Modal de suppression */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>Êtes-vous sûr de vouloir supprimer cette affectation ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de mise à jour */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Mettre à jour l'affectation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="employee" className="form-label">
                Employé :
              </label>
              <select
                className="form-control"
                id="employee"
                name="employee"
                value={selectedAffectation ? selectedAffectation.employee._id : ''}
                onChange={(e) => handleUpdateField('employee', e.target.value)}
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
                value={selectedAffectation ? selectedAffectation.bureau._id : ''}
                onChange={(e) => handleUpdateField('bureau', e.target.value)}
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
                onChange={(e) => handleUpdateField('decision', e.target.files[0])}
              />
            </div>
            <Button variant="primary" onClick={handleUpdateAffectation}>
              Mettre à jour l'affectation
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AffectationList;
