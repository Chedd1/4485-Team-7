import axios from 'axios';

// When porting to AWS and running on that server, set baseURL to its IP address
const api = axios.create({
    baseURL: "http://localhost:8000/"
});

// Export the Axios instance
export default api;