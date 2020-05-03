import React from 'react';

import { NewFlats } from './../components/NewFlats';

const Main = props => {
  return (
    <>
      <div className="sidebar">Search &amp; filter</div>
      <div className="content">
        <NewFlats />
      </div>
    </>
  );
};

export default Main;
