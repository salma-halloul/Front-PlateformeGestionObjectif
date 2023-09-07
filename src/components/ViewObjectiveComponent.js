import React, { useState, useEffect } from 'react';
import ObjectiveService from "../services/ObjectiveService";
import CollaboratorService from "../services/CollaboratorService";
import { Modal, Button, Form } from 'react-bootstrap';


function ViewObjectiveComponent() {
  const [objectives, setObjectives] = useState([]);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [status, setStatus] = useState(""); // Pour la mise à jour du statut
  const [currentObjective, setCurrentObjective] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [messageContent, setMessageContent] = useState("");

  


  useEffect(() => {
      ObjectiveService.getAllObjectives().then(
          (response) => {
              setObjectives(response.data);
          },
          (error) => {
              console.error("Erreur lors de la récupération des objectifs:", error);
          }
      );
  }, []);


const handleUsernameClick = (userId) => {
  if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(prevUserIds => prevUserIds.filter(id => id !== userId));
  } else {
      setSelectedUserIds(prevUserIds => [...prevUserIds, userId]);
  }
}

  const handleShareClick = (objective) => {
    setCurrentObjective(objective);
    CollaboratorService.getAllCollaborators().then(response => {
        setCollaborators(response.data);
        setShowShareModal(true);  
    }).catch(error => {
        console.error("Erreur lors de la récupération des collaborateurs:", error);
    });
  };

  const handleShareObjective = (selectedUserIds) => {
    const shareObjectiveDTO = {
        objectiveId: currentObjective.id,
        userIds: selectedUserIds
    };

    ObjectiveService.shareObjective(shareObjectiveDTO)
        .then(response => {
            console.log("Objectif partagé avec succès !");
            setMessageContent("Objectif partagé avec succès !");
            setShowMessage(true);
            closeShareModal();
        })
        .catch(error => {
            console.error("Erreur lors du partage de l'objectif:", error);
            setMessageContent("Erreur lors du partage de l'objectif");
            setShowMessage(true);
        });
  }



  const handleUpdateClick = (objective) => {
      setSelectedObjective(objective);
      setStatus(objective.status || ""); 
      setShowUpdateModal(true);
  };

  const handleObjectiveUpdate = () => {
    if (selectedObjective && status) {
        const updatedData = { ...selectedObjective, status: status };

        ObjectiveService.updateObjective(selectedObjective.id, updatedData)
            .then(response => {
                const updatedObjectives = objectives.map(obj => {
                    if (obj.id === selectedObjective.id) return { ...obj, status: status };
                    return obj;
                });
                setObjectives(updatedObjectives);

                console.log("Objectif mis à jour avec succès !");
                setMessageContent("Objectif mis à jour avec succès !");
                setShowMessage(true);
                closeUpdateModal();
            })
            .catch(error => {
                console.error("Erreur lors de la mise à jour de l'objectif:", error);
                setMessageContent("Erreur lors de la mise à jour de l'objectif");
                setShowMessage(true);
            });            
    } else {
        console.error("L'objectif sélectionné ou le statut est indéfini.");
    }
};


  const closeShareModal = () => {
      setShowShareModal(false);
  };

  const closeUpdateModal = () => {
      setShowUpdateModal(false);
  };

  return (
    <div>
        <h2 className='ob-header'>Liste des Objectifs</h2>
        {showMessage && <div className="alert-message">{messageContent}</div>}
        {objectives.map((objective) => (
            <div key={objective.id} className="objective-container">
                {objective.description}
                <span className="objective-meta">Assigned by: {objective.assignedBy.username}</span> 
                <span className="objective-meta">Percentage: {objective.percentage}</span> 
                <span className="objective-meta">Statut: {objective.status}</span> 
                <span className="objective-meta">Deadline: {objective.deadline}</span> 
                <div className="button-container">
                    <Button variant="primary" onClick={() => handleShareClick(objective)}>Share</Button>
                    <Button variant="secondary" onClick={() => handleUpdateClick(objective)}>Update</Button>
                </div>
            </div>
        ))}

        <Modal show={showShareModal} onHide={closeShareModal}>
            <Modal.Header closeButton>
                <Modal.Title>Partagez l'objectif</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <h5>Sélectionnez un collaborateur :</h5>
                    <ul className="collaborator-list">
                        {collaborators.map(collaborator => (
                                <li 
                                  key={collaborator.id}
                                  className={`collaborator-item ${selectedUserIds.includes(collaborator.id) ? 'selected' : ''}`}
                                  onClick={() => handleUsernameClick(collaborator.id)}
                                >
                                  {collaborator.username}
                                </li>
                          ))}
                      </ul>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => handleShareObjective(selectedUserIds)}>
                    Share
                </Button>
                <Button variant="secondary" onClick={closeShareModal}>
                    Fermer
                </Button>
            </Modal.Footer>
        </Modal>

        <Modal show={showUpdateModal} onHide={closeUpdateModal}>
            <Modal.Header closeButton>
                <Modal.Title>Mise à jour de l'objectif</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                 <Form.Label>Statut:</Form.Label>
                 <Form.Control as="select" value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                 </Form.Control>
                 </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeUpdateModal}>
                    Fermer
                </Button>
                <Button variant="primary" onClick={handleObjectiveUpdate}>
                   Mettre à jour
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
);
}
export default ViewObjectiveComponent;
