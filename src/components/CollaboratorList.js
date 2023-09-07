import React, { useState, useEffect } from 'react';
import CollaboratorService from "../services/CollaboratorService";
import ObjectiveService from "../services/ObjectiveService";
import { Modal, Button, Form } from 'react-bootstrap';

function CollaboratorList() {
    const [collaborators, setCollaborators] = useState([]);
    const [objectives, setObjectives] = useState([]);
    const [selectedCollaborator, setSelectedCollaborator] = useState(null);
    const [percentage, setPercentage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedObjective, setSelectedObjective] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");




    useEffect(() => {
        CollaboratorService.getAllCollaborators().then(
            response => {
                setCollaborators(response.data);
            },
            error => {
                console.error("Error fetching collaborators:", error);
            }
        );
    }, []);


    const handleAssignClick = (collaborator) => {
        setSelectedCollaborator(collaborator);
        setShowModal(true);
        ObjectiveService.getAllObjectives()
            .then(objectives => {
                setObjectives(objectives.data); 
                setShowModal(true);

            })
            .catch(error => {
                console.error("Error fetching objectives:", error);
            });
    };


    const handleObjectiveClick = (objective) => {
        if(selectedObjective && selectedObjective.id === objective.id) {
            setSelectedObjective(null);  // Désélectionne si le même élément est cliqué
        } else {
            setSelectedObjective(objective);  // Sélectionne l'objectif cliqué
        }
        setShowModal(true);
    };
    

    const handleSubmit = () => {
        if (!selectedObjective) {
            setErrorMessage("Veuillez sélectionner un objectif.");
            return; 
        }
        if (selectedCollaborator && percentage && selectedObjective) {
            const ownerId = selectedCollaborator.id;
            const objectiveId = selectedObjective.id;
    
            ObjectiveService.assignObjectiveToCollaborator(ownerId, objectiveId, percentage)
                .then(response => {
                    console.log("Objectif assigné avec succès !");
                    setSuccessMessage(`Objectif assigné avec succès à ${selectedCollaborator.username}!`);
                    setShowModal(false);
                })
                .catch(error => {
                    console.error("Erreur lors de l'assignation de l'objectif:", error);
                });
        }
    };
    

    const handleClose = () => {
        setShowModal(false);
        setSelectedCollaborator(null);
        setSelectedObjective(null);
        setPercentage("");
    };

    return (
        <div className="collab-list-container">
            <h2 className="collab-header">Liste des Collaborateurs</h2>
            {successMessage && <div style={{color: 'green', marginBottom: '10px'}}>{successMessage}</div>}
            {collaborators.map(collab => (
                <div key={collab.id} className="collab-card">
                    <div className="collab-name">
                        {collab.username}
                    </div>
                    <div className="collab-email">
                        {collab.email}
                    </div>
                    <button onClick={() => handleAssignClick(collab)}>Assign</button>
                </div>
            ))}
         <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Assigner un objectif à {selectedCollaborator?.username}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Sélectionnez un objectif :</h5>
                    <div className="objective-list">
                        {objectives.map(objective => (
                            <div 
                                key={objective.id} 
                                onClick={() => handleObjectiveClick(objective)}
                                className={`objective-item ${selectedObjective && selectedObjective.id === objective.id ? 'selected' : ''}`} 
                            >
                                {objective.description}
                            </div>
                        ))}
                    </div>
                    <hr />
                    {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>} 
                    <Form.Group>
                        <Form.Label>Percentage</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={percentage} 
                            onChange={e => setPercentage(e.target.value)} 
                            placeholder="Enter percentage" 
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Confirmer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default CollaboratorList;
