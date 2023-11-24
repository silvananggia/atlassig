// services/authService.js
import axios from 'axios';

const API_URL = 'https://api.example.com'; // Replace with your API URL

const authService = {
  login: async (username, password) => {
    try {
      const response = await axios.post('/api/login', {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
