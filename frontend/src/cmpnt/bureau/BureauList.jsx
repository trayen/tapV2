import React, { useEffect, useState } from 'react';
import { getAllBureaus, deleteBureauById, updateBureauById } from '../../api/bureauApi';
import { Card, Button, Form, Modal } from 'react-bootstrap';

const BureauList = () => {
  const [bureaus, setBureaus] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBureaus, setFilteredBureaus] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBureau, setSelectedBureau] = useState(null);
  const [newBureauData, setNewBureauData] = useState({
    number: '',
    level: '',
    bloc: '',
    space: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBureauId, setDeleteBureauId] = useState(null);

  useEffect(() => {
    const fetchBureaus = async () => {
      try {
        const allBureaus = await getAllBureaus();
        setBureaus(allBureaus);
        setFilteredBureaus(allBureaus);
      } catch (error) {
        console.error('Erreur lors de la récupération des bureaux :', error);
      }
    };

    fetchBureaus();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = bureaus.filter(
      (bureau) =>
        bureau.number.toLowerCase().includes(term) ||
        bureau.level.toLowerCase().includes(term) ||
        bureau.bloc.toLowerCase().includes(term) ||
        bureau.space.toLowerCase().includes(term)
    );

    setFilteredBureaus(filtered);
  };

  const handleDelete = (bureauId) => {
    setDeleteBureauId(bureauId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteBureauById(deleteBureauId);
      const updatedBureaus = bureaus.filter((bureau) => bureau._id !== deleteBureauId);
      setBureaus(updatedBureaus);
      setFilteredBureaus(updatedBureaus);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Erreur lors de la suppression du bureau :', error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteBureauId(null);
  };

  const handleUpdate = (bureau) => {
    setSelectedBureau(bureau);
    setNewBureauData({
      number: bureau.number,
      level: bureau.level,
      bloc: bureau.bloc,
      space: bureau.space,
    });
    setShowUpdateModal(true);
  };

  const handleModalClose = () => {
    setShowUpdateModal(false);
    setSelectedBureau(null);
    setNewBureauData({
      number: '',
      level: '',
      bloc: '',
      space: '',
    });
  };

  const handleModalSave = async () => {
    try {
      const updatedBureau = await updateBureauById(selectedBureau._id, newBureauData);
      const updatedBureaus = bureaus.map((bureau) =>
        bureau._id === selectedBureau._id ? updatedBureau : bureau
      );
      setBureaus(updatedBureaus);
      setFilteredBureaus(updatedBureaus);
      handleModalClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du bureau :', error);
    }
  };

  return (
    <div>
      <h2>Liste des Bureaux</h2>
      <Form.Group controlId="search">
        <Form.Control
          type="text"
          placeholder="Rechercher des bureaux..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <br />
      </Form.Group>
      {filteredBureaus.map((bureau) => (
        <div key={bureau._id}>
          <Card className="mb-3">
            <Card.Body>
              <div className="info">
                <Card.Title>{bureau.number}</Card.Title>
                <div className="bureau-info">
                  <strong>niveau :</strong> {bureau.level}
                </div>
                <div className="bureau-info">
                  <strong>Bloc :</strong> {bureau.bloc}
                </div>
                <div className="bureau-info">
                  <strong>Espace :</strong> {bureau.space}
                </div>
              </div>
            </Card.Body>
            <Card.Footer className="d-flex flex-column ">
              <Button
                variant="success"
                size="md"
                onClick={() => handleUpdate(bureau)}
                className="mb-2"
              >
                Mettre à jour
              </Button>
              <Button variant="danger" size="md" onClick={() => handleDelete(bureau._id)}>
                Supprimer
              </Button>
            </Card.Footer>
          </Card>
        </div>
      ))}
      <Modal show={showUpdateModal} onHide={handleModalClose}>
        {/* ... (rest of the modal for update) */}
      </Modal>
      <Modal show={showDeleteModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer ce bureau ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BureauList;
