import React from 'react';
import { Button } from 'antd';
import { NewFlats } from './components/NewFlats';

function App() {
  return (
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
  );
}

export default App;
