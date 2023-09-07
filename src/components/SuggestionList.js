import React, { useState, useEffect } from 'react';
import SuggestionService from "../services/SuggestionService";

function SuggestionList() {
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        SuggestionService.getAllSuggestions().then(
            response => {
                setSuggestions(response.data);
            },
            error => {
                console.error("Error fetching suggestions:", error);
            }
        );
    }, []);

    const handleApprove = (id) => {
        SuggestionService.approveSuggestion(id).then(
            () => {
                return SuggestionService.getAllSuggestions();
            }
        ).then(response => {
            setSuggestions(response.data);
        });
    };

    const handleReject = (id) => {
        SuggestionService.rejectSuggestion(id).then(
            () => {
                return SuggestionService.getAllSuggestions();
            }
        ).then(response => {
            setSuggestions(response.data);
        });
    };

    return (
        <div className="suggestion-list-container">
            <h2 className="suggestion-header">Suggestions</h2>
            {suggestions.map(suggestion => (
                <div key={suggestion.id} className="suggestion-card">
                    <div className="suggestion-description">
                        {suggestion.description}
                    </div>
                    <div className="suggestion-footer">
                        <div className="suggested-by">
                            Suggested By: {suggestion.suggestedBy.username}
                        </div>
                        <div>
                            <button className="approve-btn" onClick={() => handleApprove(suggestion.id)}>Approuver</button>
                            <button className="reject-btn" onClick={() => handleReject(suggestion.id)}>Rejeter</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
    
}
export default SuggestionList;