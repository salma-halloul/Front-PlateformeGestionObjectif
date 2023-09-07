import axios from 'axios';
import authHeader from './auth-header';

const API_URL = "http://localhost:8088/api/suggestions"; 

class SuggestionService {
    getAllSuggestions() {
        return axios.get(API_URL, { headers: authHeader() });
    }

    getSuggestionById(id) {
        return axios.get(API_URL + '/' + id, { headers: authHeader() });
    }

    createSuggestion(suggestionData) {
        return axios.post(API_URL, suggestionData, { headers: authHeader() });
    }

    approveSuggestion(id) {
       return axios.post(`${API_URL}/${id}/approve`, { headers: authHeader() });
    }

    rejectSuggestion(id) {
        return axios.post(API_URL + '/' + id + '/reject', { headers: authHeader() });
    }

    deleteSuggestion(id) {
        return axios.delete(API_URL + `/${id}`, { headers: authHeader() });
    }
}

export default new SuggestionService();

