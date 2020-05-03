import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';

import firebase from './../firebase';
import { setAuth, unsetAuth, setToken } from './../../store/auth/actions';

export const AuthWatcher = ({ user, setUser, unsetUser, setToken }) => {
  useEffect(() => {
    firebase.auth.onAuthStateChanged(function(user) {
      if (user) {
        setUser(user);
        user.getIdToken().then(token => {
          setToken(token);
        });
      } else if (!user) {
        unsetUser();
      }
    });
  }, [firebase]);

  useEffect(() => {
    firebase.auth.onIdTokenChanged(function(user) {
      if (user) {
        user.getIdToken().then(token => {
          setToken(token);
        });
      } else if (!user) {
        unsetUser();
      }
    });
  }, [firebase]);

  return <Fragment></Fragment>;
};

const mapStateToProps = state => ({ user: state.auth.user });

const mapDispatchToProps = dispatch => ({
  setUser: user => dispatch(setAuth({ user: user })),
  unsetUser: () => dispatch(unsetAuth()),
  setToken: token => dispatch(setToken({ token })),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthWatcher);
