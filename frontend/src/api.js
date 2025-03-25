import axios from 'axios';

// When porting to AWS and running on that server, set baseURL to its IP address
const api = axios.create({
    baseURL: "https://brave-wave-09bfea010.6.azurestaticapps.net/"
    // baseURL: "108.156.91.21:443"
});

// Export the Axios instance
export default api;