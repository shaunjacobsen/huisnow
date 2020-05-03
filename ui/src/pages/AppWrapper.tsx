import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

interface Props {
  children: React.ReactNode;
}

const AppWrapper = (props: Props) => {
  const { children } = props;
  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <h1>
            Huis<span>Now</span>
          </h1>
          <div className="user">
            <Avatar size="large" icon={<UserOutlined />} />
          </div>
        </div>
        <div className="content-container">{children}</div>

        <div className="footer">footer</div>
      </div>
    </div>
  );
};

export default AppWrapper;
