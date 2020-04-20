import axios from 'axios';

const propertyRequester = axios.create({
  baseURL: process.env.REACT_APP_PROPERTY_API || 'http://localhost:4000',
  timeout: 5000,
});

export default propertyRequester;