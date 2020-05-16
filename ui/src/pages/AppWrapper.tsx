import React from 'react';

import { AuthWatcher } from '../firebase/auth_watcher';
import { getCurrentUser } from '../store/auth/selectors';
import { UserAvatar } from '../components/User/UserAvatar';

interface Props {
  children: React.ReactNode;
}

const AppWrapper = (props: Props) => {
  const { children } = props;

  return (
    <div className="App">
      <AuthWatcher />
      <div className="container">
        <div className="header">
          <h1>
            Huis<span>Now</span>
          </h1>
          <div className="user">
            <UserAvatar />
          </div>
        </div>
        <div className="content-container">{children}</div>

        <div className="footer">footer</div>
      </div>
    </div>
  );
};

export default AppWrapper;
