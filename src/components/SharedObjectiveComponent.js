import React, { useState, useEffect } from 'react';
import ObjectiveService from '../services/ObjectiveService';

function SharedObjectivesComponent() {
  const [sharedObjectives, setSharedObjectives] = useState([]);

  useEffect(() => {
      ObjectiveService.getSharedObjectives().then(
          (response) => {
              setSharedObjectives(response.data);
          },
          (error) => {
              console.error("Erreur lors de la récupération des objectifs partagés:", error);
          }
      );
  }, []);

  return (
      <div className="shared-objectives-container">
          <h2>Objectifs partagés avec moi</h2>
          <ul>
              {sharedObjectives.map((objective) => (
                  <li key={objective.id} className="shared-objective-item">
                      <p>{objective.description}</p>
                      <p><em>Partagé par {objective.ownerUsername}</em></p>
                  </li>
              ))}
          </ul>
      </div>
  );
}

export default SharedObjectivesComponent;

