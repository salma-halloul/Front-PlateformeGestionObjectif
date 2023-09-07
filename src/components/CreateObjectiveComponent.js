import React, { useState } from 'react';
import ObjectiveService from "../services/ObjectiveService";

const CreateObjectiveComponent = () => {
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [deadline, setDeadline] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const objectiveData = {
            description,
            status,
            deadline
        };

        try {
            await ObjectiveService.createObjective(objectiveData);
            alert('Objective successfully created!');
        } catch (error) {
            console.error('Error creating objective:', error);
            alert('Error creating objective. Please try again.');
        }
    };

    return (
        <div className="container">
            <h2>Create Objective</h2>
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
                <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select 
                        id="status" 
                        className="form-control" 
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    >
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="deadline" className="form-label">Deadline</label>
                    <input 
                        type="datetime-local"
                        id="deadline" 
                        className="form-control"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-primary">Create Objective</button>
            </form>
        </div>
    );
};

export default CreateObjectiveComponent;
