import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8088/api/notifications';

class NotificationService {
  getAllUserNotifications() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getNotificationById(id) {
    return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
  }
}

export default new NotificationService();

