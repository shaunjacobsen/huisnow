import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import firebase from './../firebase';
import {
  setAuth,
  unsetAuth,
  setToken,
  fetchUser,
} from './../store/auth/actions';

export const AuthWatcher = props => {
  const user = useSelector(state => state.auth.user);

  const dispatch = useDispatch();

  useEffect(() => {
    firebase.auth.onAuthStateChanged(function (user) {
      if (user) {
        dispatch(fetchUser());
        // dispatch(setAuth({ user: user }));
        user.getIdToken().then(token => {
          dispatch(setToken({ token }));
        });
      } else if (!user) {
        dispatch(unsetAuth());
      }
    });
  }, [firebase]);

  useEffect(() => {
    firebase.auth.onIdTokenChanged(function (user) {
      if (user) {
        user.getIdToken().then(token => {
          dispatch(setToken({ token }));
        });
      } else if (!user) {
        dispatch(unsetAuth());
      }
    });
  }, [firebase]);

  return <Fragment></Fragment>;
};

export default AuthWatcher;
