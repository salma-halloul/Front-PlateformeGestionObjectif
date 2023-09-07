import React, { useState, useEffect } from "react";
import SuggestionService from "../services/SuggestionService";
import { Button } from 'react-bootstrap'; 

function MySuggestComponent() {
    const [suggestions, setSuggestions] = useState([]);
    const [message, setMessage] = useState("");


    useEffect(() => {
        SuggestionService.getAllSuggestions().then(
            (response) => {
                setSuggestions(response.data);
            },
            (error) => {
                console.error("Erreur lors de la récupération des suggestions:", error);
            }
        );
    }, []);

    const handleDelete = (suggestionId) => {
        SuggestionService.deleteSuggestion(suggestionId)
            .then(() => {
                const updatedSuggestions = suggestions.filter(suggestion => suggestion.id !== suggestionId);
                setSuggestions(updatedSuggestions);
                console.log("Suggestion supprimée avec succès !");
                setMessage("Suggestion supprimée avec succès !");

            })
            .catch(error => {
                console.error("Erreur lors de la suppression de la suggestion:", error);
            });
    };
    

    return (
        <div className="suggestions-container">
            <h2 className="suggestions-header">Mes Suggestions</h2>
            {message && <div className="success-message">{message}</div>}
            {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="suggestion-card">
                    <div className="suggestion-description">
                        {suggestion.description}
                    </div>
                    <div className="suggestion-status">
                        Statut: {suggestion.status}
                    </div>
                    <Button variant="danger" onClick={() => handleDelete(suggestion.id)}>Delete</Button>
                </div>
            ))}
        </div>
    );
}

export default MySuggestComponent;