import axios from 'axios';
import authHeader from './auth-header';

const API_URL = "http://localhost:8088/api/objectives"; 

class ObjectiveService {

    getAllObjectives() {
        return axios.get(API_URL, { headers: authHeader() });
    }

    getObjectiveById(id) {
        return axios.get(API_URL + `/${id}`, { headers: authHeader() });
    }

    createObjective(objectiveData) {
        return axios.post(API_URL, objectiveData, { headers: authHeader() });
    }

    updateObjective(id, objectiveData) {
        return axios.put(API_URL + `/${id}`, objectiveData, { headers: authHeader() });
    }

    deleteObjective(id) {
        return axios.delete(API_URL + `/${id}`, { headers: authHeader() });
    }

    assignObjectiveToCollaborator(ownerId, objectiveId, percentage) {
        return axios.post(API_URL + `/assign/${ownerId}/${objectiveId}`, { percentage }, { headers: authHeader() });
    }

    shareObjective(shareObjectiveDTO) {
        return axios.post(API_URL + "/share", shareObjectiveDTO, { headers: authHeader() });
    }

    getSharedObjectives() {
        return axios.get(API_URL + "/shared-with-me", { headers: authHeader() });
    }

    getObjectivesStatusCount() {
        return axios.get(`${API_URL}/status-count`, { headers: authHeader() })

    }

    getObjectivesDeadlines() {
        return axios.get(`${API_URL}/deadlines`, { headers: authHeader() })
    }
}

export default new ObjectiveService();


