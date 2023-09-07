import React, { useState } from 'react';
import SuggestionService from "../services/SuggestionService";

const SuggestObjectiveComponent = () => {
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const suggestionData = {
            description
        };

        try {
            await SuggestionService.createSuggestion(suggestionData);
            alert('Objective suggestion successfully created!');
        } catch (error) {
            console.error('Error creating objective suggestion:', error);
            alert('Error creating objective suggestion. Please try again.');
        }
    };
    return (
        <div className="container">
            <h2>Suggest Objective</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea 
                        id="description" 
                        className="form-control" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-primary">Suggest Objective</button>
            </form>
        </div>
    );
};

export default SuggestObjectiveComponent;
