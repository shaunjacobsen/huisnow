import React from 'react';
import { Provider } from 'react-redux';
import { Button } from 'antd';

import { NewFlats } from './components/NewFlats';

import store from './store';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <div className="container">
          <div className="header">
            <h1>
              Huis<span>Now</span>
            </h1>
          </div>
          <div className="sidebar">Search &amp; filter</div>
          <div className="content">
            <NewFlats />
          </div>
          <div className="footer">footer</div>
        </div>
      </div>
    </Provider>
  );
}

export default App;
