import axios from 'axios';

import Firebase from '../firebase/index';

// const propertyRequester = axios.create({
//   baseURL: process.env.REACT_APP_PROPERTY_API || 'http://localhost:4000',
//   timeout: 5000,
//   headers: {
//     'X-auth': 'some',
//   },
// });

const currentUser = async () => await Firebase.auth.currentUser;

async function getHeaders(user) {
  let headers = {};
  if (user) {
    headers['X-auth'] = await user.getIdToken();
  }

  return headers;
}

const propertyRequester = async (options = { authRequired: false }) => {
  let user = await currentUser();
  if (!options.authRequired && !user) {
    return axios.create({
      baseURL: process.env.REACT_APP_PROPERTY_API || 'http://localhost:4000',
      timeout: 5000,
    });
  }

  if (options.authRequired && !user) {
    throw new Error('Authentication required');
  }

  return axios.create({
    baseURL: process.env.REACT_APP_PROPERTY_API || 'http://localhost:4000',
    timeout: 5000,
    headers: await getHeaders(user),
  });
};

export default propertyRequester;
