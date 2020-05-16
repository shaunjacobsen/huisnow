import axios from 'axios';
import Cookies from 'universal-cookie';
import { Dispatch } from 'redux';

import firebase from './../../firebase';
import propertyRequester from '../../utils/axios';

const cookies = new Cookies();

export const signIn = (payload: { email: string; password: string }) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: 'AUTH:SIGN_IN/START' });
    try {
      const requester = await propertyRequester();
      const response = await requester.post('/user/sign_in', payload);
      const token = response.config.headers['X-auth'];

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

export const fetchUser = () => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: 'AUTH:GET_USER/START' });

    let token = cookies.get('_token');
    if (!token) {
      // TODO: need to get the refresh token and try that
      console.error('no token in cookies');
      return;
    }
    try {
      const requester = await propertyRequester({ authRequired: true });
      const response = await requester.get('/user');
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

export const setAuth = (payload: any) => ({ type: 'AUTH:SET_USER', payload });

export const unsetAuth = () => ({ type: 'AUTH:UNSET_USER' });

export const setToken = (payload: { token: string }) => {
  return (dispatch: Dispatch) => {
    cookies.set('_token', payload.token);
    dispatch({
      type: 'AUTH:SET_TOKEN',
      payload,
    });
  };
};
