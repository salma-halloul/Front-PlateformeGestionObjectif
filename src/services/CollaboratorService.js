import axios from 'axios';

const API_URL = "http://localhost:8088/api/users/collaborators";

class CollaboratorService {
    getAllCollaborators() {
        return axios.get(API_URL);
    }
}

export default new CollaboratorService();