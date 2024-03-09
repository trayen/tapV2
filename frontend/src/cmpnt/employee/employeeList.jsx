// Importez les dépendances nécessaires et les fonctions API
import React, { useEffect, useState } from 'react';
import { getAllEmployees, deleteEmployeeById, updateEmployeeById } from '../../api/employeeApi';
import { getAffectationById } from '../../api/affectationApi';
import { getBureauById } from '../../api/bureauApi';
import { Card, Button, Collapse, Form, Modal } from 'react-bootstrap';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [affectationDetails, setAffectationDetails] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeIdToDelete, setEmployeeIdToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [openAffectation, setOpenAffectation] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newEmployeeData, setNewEmployeeData] = useState({
    name: '',
    matricule: '',
    emploi: '',
    affectationId: '', // Change affectation field to affectationId
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const allEmployees = await getAllEmployees();
        setEmployees(allEmployees);
        setFilteredEmployees(allEmployees);
      } catch (error) {
        console.error('Erreur lors de la récupération des employés :', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(term) ||
        employee.matricule.toLowerCase().includes(term) ||
        employee.emploi.toLowerCase().includes(term)
    );

    setFilteredEmployees(filtered);
  };

  const toggleAffectation = async (employee) => {
    setOpenAffectation((prevOpen) => (prevOpen === employee._id ? '' : employee._id));
    if (openAffectation !== employee._id) {
      try {
        if (employee.affectation) {
          const affectation = await getAffectationById(employee.affectation);
          const bureauId = affectation.bureau._id; // Extract the _id field

          const bureau = await getBureauById(bureauId);

          setAffectationDetails({ affectation, bureau });
        } else {
          setAffectationDetails(null);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'affectation ou du bureau :', error);
        setAffectationDetails(null);
      }
    }
  };

  const handleShowDeleteModal = (employeeId) => {
    setEmployeeIdToDelete(employeeId);
    setShowDeleteModal(true);
  };

  const handleHideDeleteModal = () => {
    setEmployeeIdToDelete(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    try {
      await deleteEmployeeById(employeeIdToDelete);
      const updatedEmployees = employees.filter((employee) => employee._id !== employeeIdToDelete);
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees);
      handleHideDeleteModal();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'employé :', error);
    }
  };

  const handleUpdate = (employee) => {
    setSelectedEmployee(employee);
    setNewEmployeeData({
      name: employee.name,
      matricule: employee.matricule,
      emploi: employee.emploi,
      affectationId: employee.affectationId, // Change affectation field to affectationId
    });
    setShowUpdateModal(true);
  };

  const handleModalClose = () => {
    setShowUpdateModal(false);
    setSelectedEmployee(null);
    setNewEmployeeData({
      name: '',
      matricule: '',
      emploi: '',
      affectationId: '', // Change affectation field to affectationId
    });
  };

  const handleModalSave = async () => {
    try {
      const updatedEmployee = await updateEmployeeById(selectedEmployee._id, newEmployeeData);
      const updatedEmployees = employees.map((employee) =>
        employee._id === selectedEmployee._id ? updatedEmployee : employee
      );
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees);
      handleModalClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'employé :', error);
    }
  };

  return (
    <div>
      <h2>Liste des Employés</h2>
      <Form.Group controlId="search">
        <Form.Control
          type="text"
          placeholder="Rechercher des employés..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <br />
      </Form.Group>

      {Array.isArray(filteredEmployees) ? (
        filteredEmployees.map((employee) => (
          <div key={employee._id}>
            <Form>
              <Card className="mb-3">
                <Card.Body>
                  <div className="info">
                    <Card.Title>{employee.name}</Card.Title>
                    <div className="employee-info">
                      <strong>Matricule :</strong> {employee.matricule}
                    </div>
                    <div className="employee-info">
                      <strong>Emploi :</strong> {employee.emploi}
                    </div>
                  </div>
                  <Button
                    onClick={() => toggleAffectation(employee)}
                    aria-controls={`affectation-${employee._id}`}
                    aria-expanded={openAffectation === employee._id}
                    variant="primary"
                    className="mr-2"
                  >
                    Afficher l'Affectation
                  </Button>

                  <Collapse in={openAffectation === employee._id}>
                    <div id={`affectation-${employee._id}`} className="mt-2">
                      {affectationDetails && (
                        <div>
                          <h5>Détails de l'Affectation</h5>
                          <div>
                            <strong>Détails du Bureau :</strong>
                            <p>
                              <strong>Numéro :</strong> {affectationDetails.bureau.number}
                            </p>
                            <p>
                              <strong>Bloc :</strong> {affectationDetails.bureau.bloc}
                            </p>
                            <p>
                              <strong>Niveau :</strong> {affectationDetails.bureau.level}
                            </p>
                          </div>
                        </div>
                      )}
                      {!affectationDetails && (
                        <div>
                          <p>Aucune affectation pour cet employé</p>
                        </div>
                      )}
                    </div>
                  </Collapse>
                </Card.Body>

                <Card.Footer className="d-flex flex-column">
                  <Button variant="danger" onClick={() => handleShowDeleteModal(employee._id)}>
                    Supprimer
                  </Button>
                  <br />
                  <Button
                    variant="success"
                    size="md"
                    onClick={() => handleUpdate(employee)}
                    className="mb-2"
                  >
                    Mettre à jour
                  </Button>
                </Card.Footer>
              </Card>
            </Form>
          </div>
        ))
      ) : (
        <p>No employees found</p>
      )}
      <Modal show={showUpdateModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Mettre à jour l'Employé</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez le nom"
                value={newEmployeeData.name}
                onChange={(e) => setNewEmployeeData({ ...newEmployeeData, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formMatricule">
              <Form.Label>Matricule</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez le matricule"
                value={newEmployeeData.matricule}
                onChange={(e) => setNewEmployeeData({ ...newEmployeeData, matricule: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formEmploi">
              <Form.Label>Emploi</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez l'emploi"
                value={newEmployeeData.emploi}
                onChange={(e) => setNewEmployeeData({ ...newEmployeeData, emploi: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Fermer
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            Enregistrer les modifications
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={handleHideDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Supprimer l'Employé</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer cet employé ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleHideDeleteModal}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeeList;
