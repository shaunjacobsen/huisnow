import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Button } from 'antd';

import Main from './pages/Main';
import SignIn from './pages/SignIn';

import store from './store';
import AppWrapper from './pages/AppWrapper';

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <AppWrapper>
          <Switch>
            <Route path="/sign_in">
              <SignIn />
            </Route>
            <Route path="/">
              <Main />
            </Route>
          </Switch>
        </AppWrapper>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
