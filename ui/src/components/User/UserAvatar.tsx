import React from 'react';
import { useSelector } from 'react-redux';
import { LoadingOutlined, UserOutlined } from '@ant-design/icons';

import { Avatar } from 'antd';

import { getCurrentUser, isSigningIn } from '../../store/auth/selectors';

export const UserAvatar = () => {
  const user = useSelector(getCurrentUser);
  const isLoadingUser = useSelector(isSigningIn);

  if (isLoadingUser) {
    return <Avatar size="large" icon={<LoadingOutlined />} />;
  } else if (user && user.avatarUri) {
    return <Avatar size="large" src={user.avatarUri} />;
  } else {
    return <Avatar size="large" icon={<UserOutlined />} />;
  }
};
