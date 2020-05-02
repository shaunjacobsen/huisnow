import axios from 'axios';
import Cookies from 'universal-cookie';
// import { pick } from 'lodash';

import firebase from './../../utils/firebase';

// import { request } from './../../utils/http/request';

const cookies = new Cookies();

export const signIn = (payload: { username: string; password: string }) => {
  return async dispatch => {
    dispatch({ type: 'AUTH:SIGN_IN/START' });
    try {
      const response = await axios.post(
        `${process.env.API_URL}/user/signin`,
        payload,
      );
      const token = response.headers['x-auth'];

      firebase.auth
        .signInWithEmailAndPassword(response.data.user.email, payload.password)
        .then(() => {
          cookies.set('_token', token);
          dispatch({ type: 'AUTH:SIGN_IN/SUCCESS', payload: response.data });
        })
        .catch(e => {
          throw new Error(e.code);
        });
    } catch (e) {
      dispatch({ type: 'AUTH:SIGN_IN/ERROR', payload: e });
    }
  };
};

export const getUser = () => {
  return async dispatch => {
    dispatch({ type: 'AUTH:GET_USER/START' });

    let token = cookies.get('_token');
    if (!token) {
      // TODO: need to get the refresh token and try that
      console.error('no token in cookies');
      return;
    }
    try {
      const response = await axios.get(`${process.env.API_URL}/user`, {
        headers: {
          'X-auth': token,
        },
      });
      // const username = models.
      // const userData = {
      //   userId: response.data.uid,
      // };
      dispatch({
        type: 'AUTH:GET_USER/SUCCESS',
        payload: response.data,
      });
    } catch (e) {
      dispatch({ type: 'AUTH:GET_USER/ERROR', payload: e });
    }
  };
};

export const setAuth = payload => ({ type: 'AUTH:SET_USER', payload });

export const unsetAuth = () => ({ type: 'AUTH:UNSET_USER' });

export const setToken = (payload: { token: string }) => {
  return dispatch => {
    cookies.set('_token', payload.token);
    dispatch({
      type: 'AUTH:SET_TOKEN',
      payload,
    });
  };
};
