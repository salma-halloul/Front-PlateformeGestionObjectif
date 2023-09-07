import React, { useState, useEffect } from 'react';
import ObjectiveService from "../services/ObjectiveService";
import { Modal, Button, Form } from 'react-bootstrap'; 

function ObjectiveList() {
    const [objectives, setObjectives] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedObjective, setSelectedObjective] = useState(null);
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        ObjectiveService.getAllObjectives().then(
            response => {
                setObjectives(response.data);
            },
            error => {
                console.error("Error fetching objectives:", error);
            }
        );
    }, []);
    
    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0,16); // Prend la date et la tranche pour obtenir le format "YYYY-MM-DDTHH:MM"
    }

    const handleOpenModal = (objective) => {
        setSelectedObjective(objective);
        setDescription(objective.description);
        setDeadline(formatDateForInput(objective.deadline));
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedObjective(null);
    };
    
    const handleDelete = async (id) => {
        try {
            await ObjectiveService.deleteObjective(id);
            const updatedObjectives = objectives.filter(obj => obj.id !== id);
            setObjectives(updatedObjectives);
            setErrorMessage("");  
            setSuccessMessage("Objectif supprimé avec succès."); 
        } catch (error) {
            console.error("Error deleting objective:", error);
            setErrorMessage(error.response?.data?.message || "Une erreur s'est produite lors de la suppression de l'objectif.");
        }
    };
    
    

    const handleSubmitUpdate = () => {
        const updatedObjective = {
            ...selectedObjective,
            description,
            deadline
        };
    
        ObjectiveService.updateObjective(selectedObjective.id, updatedObjective)
            .then(response => {
                const updatedObjectives = objectives.map(obj => 
                    obj.id === selectedObjective.id ? updatedObjective : obj
                );
                setObjectives(updatedObjectives);
                handleCloseModal();
            })
            .catch(error => {
                console.error("Error updating objective:", error);
            });
    };
    

    return (
        <div className="objective-list-container">
        <h2 className="objective-header">Liste des Objectifs</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}  
            {objectives.map(objective => (
                <div key={objective.id} className="objective-card">
                    <div className="objective-description">
                        {objective.description}
                    </div>
                    <div className="objective-deadline">
                        Deadline: {new Date(objective.deadline).toLocaleDateString()}
                    </div>
                    <button className="update-btn" onClick={() => handleOpenModal(objective)}>Update</button>
                    <button className="delete-btn" onClick={() => handleDelete(objective.id)}>Delete</button>
                </div>
            ))}

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Mettre à jour l'objectif</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={description} 
                            onChange={e => setDescription(e.target.value)} 
                            placeholder="Enter description" 
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Deadline</Form.Label>
                        <Form.Control 
                            type="datetime-local" 
                            value={deadline} 
                            onChange={e => setDeadline(e.target.value)} 
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Annuler
                    </Button>
                    <Button variant="primary"  onClick={handleSubmitUpdate}>
                        Mettre à jour
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ObjectiveList;
