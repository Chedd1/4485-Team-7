import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tweetService = {
  // Get all tweets
  getAllTweets: async () => {
    try {
      const response = await api.get('/tweets');
      return response.data;
    } catch (error) {
      console.error('Error fetching tweets:', error);
      throw error;
    }
  },

  // Get tweets by keyword
  getTweetsByKeyword: async (keyword) => {
    try {
      const response = await api.get(`/tweets/keyword/${keyword}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tweets by keyword:', error);
      throw error;
    }
  },

  // Get tweet locations for heatmap
  getTweetLocations: async () => {
    try {
      const response = await api.get('/tweets/locations');
      return response.data;
    } catch (error) {
      console.error('Error fetching tweet locations:', error);
      throw error;
    }
  },

  // Add a new tweet
  addTweet: async (tweet) => {
    try {
      const response = await api.post('/tweets', tweet);
      return response.data;
    } catch (error) {
      console.error('Error adding tweet:', error);
      throw error;
    }
  },
};

export default api; 