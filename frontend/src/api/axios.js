import axios from "axios";

export default axios.create({
    baseURL: 'http://172.23.73.42/api',
    headers: {'Content-Type': 'application/json'},
    
});